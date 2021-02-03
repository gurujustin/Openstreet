from rest_framework import viewsets
from rest_framework.response import Response
from articles.models import FinalCSV, FinalCSVTable, Portfolio, PortfolioStats, TDState
from .serializers import FinalCSVSerializer, FinalCSVTableSerializer, TableSerializer, PortfolioSerializer, PortfolioStatsSerializer, UserSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
import pandas as pd
import numpy as np
import quandl
import json
from datetime import datetime as dt
from td.client import TDClient
from rest_framework import generics
from td.utils import TDUtilities
import requests
from datetime import timedelta
import datetime
from rest_framework.pagination import PageNumberPagination
pd.set_option('use_inf_as_na', True)
quandl.ApiConfig.api_key="XVyca-iwEKxHPLniCt5D"

class TDClientAuth(TDClient):
    def __init__(self, user, client_id: str, redirect_uri: str, account_number: str = None, 
                       auth_flow: str = 'default', _do_init: bool = True) -> None:     

        # Define the configuration settings.
        self.config = {
            'cache_state': True,
            'api_endpoint': 'https://api.tdameritrade.com',
            'api_version': 'v1',
            'auth_endpoint': 'https://auth.tdameritrade.com/auth',
            'token_endpoint': 'oauth2/token',
            'refresh_enabled': True
        }
        
        # Define the initalized state, these are the default values.
        self.state = {
            'access_token': None,
            'refresh_token': None,
            'logged_in': False
        }

        self.auth_flow = auth_flow
        self.client_id = client_id
        self.redirect_uri = redirect_uri
        self.account_number = account_number
        
        self.user = TDState.objects.filter(user=User(id=user))
        if(not self.user):
            self.user=TDState(user=User(id=user), td_state=json.loads("[]"))
        else:
            self.user = self.user[0]
        self._td_utilities = TDUtilities()

        
        self._flask_app = None
        
        # define a new attribute called 'authstate' and initialize to `False`. This will be used by our login function.
        self.authstate = False

        # call the state_manager method and update the state to init (initalized)
        if _do_init:
            self._state_manager('init')

        # Initalize the client with no streaming session.
        self.streaming_session = None

    def exchange_code_for_token(self, code: str, return_refresh_token: bool) -> dict:
        # Define the parameters of our access token post.
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id + '@AMER.OAUTHAP',
            'code': self.code,
            'redirect_uri': self.redirect_uri
        }

        if return_refresh_token:
            data['access_type'] = 'offline'

        # Make the request.
        response = requests.post(
            url="https://api.tdameritrade.com/v1/oauth2/token",
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data=data
        )
        
        if response.ok:

            self._token_save(
                token_dict=response.json(),
                includes_refresh=True
            )

            return True

    def oauth(self, code) -> None:
        self.code = code

        # Exchange the Code for an Acess Token.
        self.exchange_code_for_token(
            code=self.code,
            return_refresh_token=True
        )
    def login_from_file(self) -> bool:
        """Logs the user into the TD Ameritrade API.

        Ask the user to authenticate  themselves via the TD Ameritrade Authentication Portal. This will
        create a URL, display it for the User to go to and request that they paste the final URL into
        command window. Once the user is authenticated the API key is valide for 90 days, so refresh
        tokens may be used from this point, up to the 90 days.

        ### Returns:
        ----
        {bool} -- Specifies whether it was successful or not.
        """

        # Only attempt silent SSO if the credential file exists.
        if self.user.td_state!=None and self._silent_sso():
            
            self.authstate = True
            return True
        else:
            return False
        
        if self._flask_app and self.auth_flow == 'flask':
            run(flask_client=self._flask_app, close_after=True)

    def _state_manager(self, action: str) -> None:
        """Manages the session state.

        Manages the self.state dictionary. Initalize State will set
        the properties to their default value. Save will save the 
        current state if 'cache_state' is set to TRUE.

        ### Arguments:
        ----
        action {str}: action argument must of one of the following:
            'init' -- Initalize State.
            'save' -- Save the current state.
        """

        # if they allow for caching and the file exists then load it.
        if action == 'init' and self.user.td_state!=None:
            self.state.update(self.user.td_state)

        # if they want to save it and have allowed for caching then load the file.
        elif action == 'save':    
            self.user.td_state = self.state
            self.user.save()

    def login_from_code(self, code) -> bool:
        """Logs the user into the TD Ameritrade API.

        Ask the user to authenticate  themselves via the TD Ameritrade Authentication Portal. This will
        create a URL, display it for the User to go to and request that they paste the final URL into
        command window. Once the user is authenticated the API key is valide for 90 days, so refresh
        tokens may be used from this point, up to the 90 days.

        ### Returns:
        ----
        {bool} -- Specifies whether it was successful or not.
        """

        # Only attempt silent SSO if the credential file exists.
        self.oauth(code)
        self.authstate = True
        return True
        
        if self._flask_app and self.auth_flow == 'flask':
            run(flask_client=self._flask_app, close_after=True)

    def validate_token(self) -> bool:
        """Validates whether the tokens are valid or not.

        ### Returns
        -------
        bool
            Returns `True` if the tokens were valid, `False` if
            the credentials file doesn't exist.
        """

        if 'refresh_token_expires_at' in self.state and 'access_token_expires_at' in self.state:

            # Grab the Expire Times.
            refresh_token_exp = self.state['refresh_token_expires_at']
            access_token_exp = self.state['access_token_expires_at']

            refresh_token_ts = datetime.datetime.fromtimestamp(refresh_token_exp)
            access_token_ts = datetime.datetime.fromtimestamp(access_token_exp)

            # Grab the Expire Thresholds.
            refresh_token_exp_threshold = refresh_token_ts - timedelta(days=2)
            access_token_exp_threshold = access_token_ts - timedelta(minutes=5)

            # Convert to Seconds.
            refresh_token_exp_threshold = refresh_token_exp_threshold.timestamp()
            access_token_exp_threshold = access_token_exp_threshold.timestamp()

            # See if we need a new Refresh Token.
            if datetime.datetime.now().timestamp() > refresh_token_exp_threshold:
                print("Grabbing new refresh token...")
                self.grab_refresh_token()

            # See if we need a new Access Token.
            if datetime.datetime.now().timestamp() > access_token_exp_threshold:
                print("Grabbing new access token...")
                self.grab_access_token()

            return True

        else:
            
            return False
    


class FinalCSVViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = FinalCSVSerializer

    def get_queryset(self):
        queryset = FinalCSV.objects.all()
        return queryset

    def apply_filters(self, queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, max_industry_rank, min_insider_rating, min_inst_rating):
        print('applying filters')
        if(min_health):
            if(min_health!=0):
                print('applying health filter', min_health)
                queryset = queryset.filter(company_health__gte=float(min_health))
        if(min_yield):
            if(min_yield!=0):
                print('applying yield filter', min_yield)
                queryset = queryset.filter(company_yield__gte=float(min_yield))
        if(min_quality):
            if(min_quality!=0):
                print('applying quality filter',min_quality)
                queryset = queryset.filter(company_quality__gte=float(min_quality))
        if(max_industry_rank):
            if(max_industry_rank!=100):
                print('applying industry filter', max_industry_rank)
                queryset = queryset.filter(industry_rank__lte=float(max_industry_rank))
        if(min_fair_value):
            if(min_fair_value!=0):
                print('applying fair value filter', min_fair_value)
                queryset = queryset.filter(fair_value_score__gte=float(min_fair_value))
        if(min_risk):
            if(min_risk!=0):
                print('applying risk filter',min_risk)
                queryset = queryset.filter(risk_score__gte=min_risk)
        if(min_insider_rating):
            if(min_insider_rating!=0):
                print('applying insider filter',min_insider_rating)
                queryset = queryset.filter(net_value_executed_pct__gte=float(min_insider_rating))
        if(min_inst_rating):
            if(min_inst_rating!=0):
                print('applying inst filter',min_inst_rating)
                queryset = queryset.filter(net_holding_pct__gte=float(min_inst_rating))
        
        return queryset


    def get_empty_stats(self, portfolio_name):
        portfolio_wealth_graph = "[]"
        portfolio_constituents = "[]"
        ps = PortfolioStats(name=Portfolio(pk=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
        serializer = PortfolioStatsSerializer(ps)
        ps.save()
        psquery = PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name))  
        serializer = PortfolioStatsSerializer(psquery, many=True)
        return serializer

    def get_hypo_stats(self, portfolio, portfolio_name, allocation):
        portfolio_wealth_graph = "[]"
        portfolio['weight'] = (1/ len(portfolio['ticker']))
        portfolio_health = round((portfolio['weight'] * portfolio['company_health']).sum())
        portfolio_yield = round((portfolio['weight'] * portfolio['company_yield']).sum())
        portfolio_quality = round((portfolio['weight'] * portfolio['company_quality']).sum())
        portfolio_industry_rank = round((portfolio['weight'] * portfolio['industry_rank']).sum())
        portfolio_fair_value = round((portfolio['weight'] * portfolio['fair_value_score']).sum())
        portfolio_risk = round((portfolio['weight'] * portfolio['risk_score']).sum())
        portfolio_insider_rating = round((portfolio['weight'] * portfolio['net_value_executed_pct']).sum())
        portfolio_inst_rating = round((portfolio['weight'] * portfolio['net_holding_pct']).sum())
        portfolio['weight'] = round(portfolio['weight']*100,2)
        portfolio_constituents = json.dumps(portfolio[['ticker',
                'ticker_name',
                'initial_allocation',
                'weight', 
                'company_health',   
                'company_yield',
                'company_quality',
                'industry_rank',
                'fair_value_score',
                'risk_score',
                'net_value_executed_pct',
                'net_holding_pct']].to_dict('records'), allow_nan=False)
        ps = PortfolioStats(name=Portfolio(pk=portfolio_name),
                            portfolio_change = 0,
                            portfolio_historical_return = None,
                            portfolio_historical_risk = None,
                            portfolio_historical_sharpe = None,
                            portfolio_allocation= allocation,
                            portfolio_wealth_graph=json.loads(portfolio_wealth_graph), 
                            portfolio_constituents=json.loads(portfolio_constituents),
                            portfolio_health = portfolio_health,
                            portfolio_yield =portfolio_yield,
                            portfolio_quality = portfolio_quality,
                            portfolio_industry_rank = portfolio_industry_rank,
                            portfolio_fair_value = portfolio_fair_value,
                            portfolio_risk = portfolio_risk,
                            portfolio_insider_rating = portfolio_insider_rating,
                            portfolio_inst_rating = portfolio_inst_rating)
        ps.save()
        psquery = PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name))
        serializer = PortfolioStatsSerializer(psquery, many=True)
        return serializer

    def compute_shares(self, portfolio, allocation, price):
        portfolio = portfolio.merge(price[['ticker','close','volume']], how='left', on='ticker')
        portfolio = portfolio.dropna(subset=['close'])
        portfolio['weight'] = portfolio['close']/portfolio['close'].sum()
        portfolio['allocation'] = float(allocation)
        portfolio['shares'] = np.floor(portfolio['allocation']* portfolio['weight'] / (portfolio['close']))

        portfolio['initial_allocation'] = portfolio['shares']*portfolio['close']
        portfolio = portfolio.rename(columns={'close':'entry_price'})
        portfolio= portfolio[portfolio['shares']!=0].reset_index(drop=True)
        return portfolio

    def get_full_stats(self, portfolio, price_series, portfolio_name):
        price_series = portfolio[['shares','ticker']].merge(price_series[['ticker','date','close']], how='outer', on=['ticker'])
        portfolio_wealth = price_series.groupby(['date']).apply(lambda x: sum(x['shares']*x['close'])).reset_index()
        portfolio_wealth = portfolio_wealth.rename(columns={0:'portfolio_wealth'})
        portfolio_wealth['portfolio_wealth'] = portfolio_wealth['portfolio_wealth'].astype('float')
        portfolio_wealth['date'] = portfolio_wealth['date'].dt.strftime('%Y-%m-%d')
        portfolio_wealth = portfolio_wealth.dropna()
        portfolio_wealth_graph = json.dumps(portfolio_wealth.to_dict('records'), allow_nan=False)
        portfolio = portfolio.merge(price_series[price_series['date']==price_series['date'].max()][['ticker','close']].rename(columns={'close':'current_price'}), how='left', on='ticker')
        portfolio['current_allocation'] = portfolio['shares']*portfolio['current_price']
        portfolio['change'] = round(portfolio['current_allocation'] - portfolio['initial_allocation'],2)    
        portfolio['weight'] = portfolio['current_allocation'] / portfolio['current_allocation'].sum()
        portfolio_health = round((portfolio['weight'] * portfolio['company_health']).sum())
        portfolio_yield = round((portfolio['weight'] * portfolio['company_yield']).sum())
        portfolio_quality = round((portfolio['weight'] * portfolio['company_quality']).sum())
        portfolio_industry_rank = round((portfolio['weight'] * portfolio['industry_rank']).sum())
        portfolio_fair_value = round((portfolio['weight'] * portfolio['fair_value_score']).sum())
        portfolio_risk = round((portfolio['weight'] * portfolio['risk_score']).sum())
        portfolio_insider_rating = round((portfolio['weight'] * portfolio['net_value_executed_pct']).sum())
        portfolio_inst_rating = round((portfolio['weight'] * portfolio['net_holding_pct']).sum())
        portfolio['weight'] = round(portfolio['weight']*100,2)
        portfolio['current_allocation'] = round(portfolio['current_allocation'],2)
        portfolio_change = round(portfolio['change'].sum(),2)
        portfolio_allocation = round(portfolio['current_allocation'].sum(),2)
        portfolio_historical_return = round(((portfolio_allocation/portfolio_wealth.head(1)['portfolio_wealth'] )**(252/len(portfolio_wealth)) -1)*100, 2)
        portfolio_historical_risk = round(np.sqrt(252)*(np.std(portfolio_wealth['portfolio_wealth'].pct_change()))*100,2)
        portfolio_historical_sharpe = round(portfolio_historical_return / portfolio_historical_risk,2)
        columns=['ticker',
                'ticker_name',
                'shares',
                'entry_price', 
                'current_price',
                'initial_allocation',
                'current_allocation',
                'change',
                'weight',
                'company_health',
                'company_yield',
                'company_quality',
                'industry_rank',
                'fair_value_score',
                'risk_score',
                'net_value_executed_pct',
                'net_holding_pct']
        constituents = (portfolio[columns].fillna('nan'))
        portfolio_constituents = json.dumps(constituents.to_dict('records'), allow_nan=False)
        ps = PortfolioStats(name=Portfolio(pk=portfolio_name),
                            portfolio_historical_return = portfolio_historical_return,
                            portfolio_historical_risk = portfolio_historical_risk,
                            portfolio_historical_sharpe = portfolio_historical_sharpe,
                            portfolio_change = portfolio_change,
                            portfolio_allocation= portfolio_allocation,
                            portfolio_wealth_graph=json.loads(portfolio_wealth_graph), 
                            portfolio_constituents=json.loads(portfolio_constituents),
                            portfolio_health = portfolio_health,
                            portfolio_yield =portfolio_yield,
                            portfolio_quality = portfolio_quality,
                            portfolio_industry_rank = portfolio_industry_rank,
                            portfolio_fair_value = portfolio_fair_value,
                            portfolio_risk = portfolio_risk,
                            portfolio_insider_rating = portfolio_insider_rating,
                            portfolio_inst_rating = portfolio_inst_rating)
        PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name)).delete()
        ps.save()
        psquery = PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name))
        serializer = PortfolioStatsSerializer(psquery, many=True)
        print(serializer.data)
        return serializer

    def compute_portfolio(self):
        token = self.request.query_params.get('token', None)
        allocation = self.request.query_params.get('allocation', None)
        date_created = self.request.query_params.get('date_created', None)
        portfolio_name = self.request.query_params.get('portfolio_name', None)
        queryset_token = Token.objects.filter(key=token)
        ps = PortfolioStats.objects.filter(name=Portfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        if len(ps.values()):
            if(len(ps.values()[0]['portfolio_constituents'])):
                columns=['ticker',
                    'ticker_name',
                    'company_health',
                    'company_yield',
                    'company_quality',
                    'industry_rank',
                    'fair_value_score',
                    'risk_score',
                    'net_value_executed_pct',
                    'net_holding_pct']
                portfolio = pd.DataFrame(ps.values()[0]['portfolio_constituents'])[columns]
            else:
                queryset = FinalCSV.objects.all()
                min_health = self.request.query_params.get('min_health', None)
                min_yield = self.request.query_params.get('min_yield', None)
                min_quality = self.request.query_params.get('min_quality', None)
                min_risk = self.request.query_params.get('min_risk', None)
                min_fair_value = self.request.query_params.get('min_fair_value', None)
                max_industry_rank = self.request.query_params.get('max_industry_rank', None)
                min_insider_rating = self.request.query_params.get('min_insider_rating', None)
                min_inst_rating = self.request.query_params.get('min_inst_rating', None)
                queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, max_industry_rank, min_insider_rating, min_inst_rating)
                portfolio = pd.DataFrame(queryset.values()).infer_objects()
                
        else:
            queryset = FinalCSV.objects.all()
            min_health = self.request.query_params.get('min_health', None)
            min_yield = self.request.query_params.get('min_yield', None)
            min_quality = self.request.query_params.get('min_quality', None)
            min_risk = self.request.query_params.get('min_risk', None)
            min_fair_value = self.request.query_params.get('min_fair_value', None)
            max_industry_rank = self.request.query_params.get('max_industry_rank', None)
            min_insider_rating = self.request.query_params.get('min_insider_rating', None)
            min_inst_rating = self.request.query_params.get('min_inst_rating', None)
            queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, max_industry_rank, min_insider_rating, min_inst_rating)
            portfolio = pd.DataFrame(queryset.values()).infer_objects()
        if(portfolio.empty):
            serializer = get_empty_stats(portfolio_name)
            return serializer
        portfolio['initial_allocation'] = float(allocation) / len(portfolio['ticker'])
        print("getting price series")
        price_series = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker=portfolio['ticker'], paginate=True)
        price = quandl.get_table('SHARADAR/SEP', ticker=portfolio['ticker'], date=date_created, paginate=True)
        print("obtained price series")
        price = price.dropna(subset=['close'])
        if(price.empty):
            serializer = self.get_hypo_stats(portfolio, portfolio_name, allocation)
            return serializer
        if 'shares' not in portfolio.columns:
            portfolio = self.compute_shares(portfolio, allocation, price)
            if portfolio.empty:
                portfolio_wealth_graph = "[]"
                portfolio_constituents = "[]"
                ps = PortfolioStats(name=Portfolio(pk=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
                serializer = PortfolioStatsSerializer(ps)
                ps.save()
                psquery = PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name))  
                serializer = PortfolioStatsSerializer(psquery, many=True)
                return serializer
        serializer = self.get_full_stats(portfolio, price_series, portfolio_name)
        return serializer

    def rebalance_portfolio(self):
        allocation = self.request.query_params.get('allocation', None)
        date_created = self.request.query_params.get('date_created', None)
        portfolio_name = self.request.query_params.get('portfolio_name', None)
        min_health = self.request.query_params.get('min_health', None)
        min_yield = self.request.query_params.get('min_yield', None)
        min_quality = self.request.query_params.get('min_quality', None)
        min_risk = self.request.query_params.get('min_risk', None)
        min_fair_value = self.request.query_params.get('min_fair_value', None)
        max_industry_rank = self.request.query_params.get('max_industry_rank', None)
        min_insider_rating = self.request.query_params.get('min_insider_rating', None)
        min_inst_rating = self.request.query_params.get('min_inst_rating', None)
        queryset = FinalCSV.objects.all()
        queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, max_industry_rank, min_insider_rating, min_inst_rating)
        portfolio = pd.DataFrame(queryset.values()).infer_objects()
        if(portfolio.empty):
            serializer = get_empty_stats(portfolio_name)
            return serializer
        portfolio['initial_allocation'] = float(allocation) / len(portfolio['ticker'])
        print("getting price series")
        price_series = quandl.get_table('SHARADAR/SEP', date={'gte':'2015-01-01'}, ticker=portfolio['ticker'], paginate=True)
        price = quandl.get_table('SHARADAR/SEP', ticker=portfolio['ticker'], date=date_created, paginate=True)
        print("obtained price series")
        price = price.dropna(subset=['close'])
        if(price.empty):
            serializer = self.get_hypo_stats(portfolio, portfolio_name, allocation)
            return serializer
        if 'shares' not in portfolio.columns:
            portfolio = self.compute_shares(portfolio, allocation, price)
            if portfolio.empty:
                portfolio_wealth_graph = "[]"
                portfolio_constituents = "[]"
                ps = PortfolioStats(name=Portfolio(pk=portfolio_name), portfolio_wealth_graph=json.loads(portfolio_wealth_graph), portfolio_constituents=json.loads(portfolio_constituents))
                serializer = PortfolioStatsSerializer(ps)
                ps.save()
                psquery = PortfolioStats.objects.filter(name=Portfolio(pk=portfolio_name))  
                serializer = PortfolioStatsSerializer(psquery, many=True)
                return serializer
        serializer = self.get_full_stats(portfolio, price_series, portfolio_name)
        return serializer

    def list(self, request, *args, **kwargs):
        action = self.request.query_params.get('action', None)
        if action=='compute':
            serializer = self.compute_portfolio()
            return Response(serializer.data)
        elif action=='execute':
            serializer = self.compute_portfolio()
            return Response(serializer.data)
        elif action=='rebalance':
            serializer_new = self.rebalance_portfolio()
            return Response(serializer_new.data)
        elif action=='search':
            allocation = self.request.query_params.get('allocation', None)
            date_created = self.request.query_params.get('date_created', None)
            portfolio_name = self.request.query_params.get('portfolio_name', None)
            min_health = self.request.query_params.get('min_health', None)
            min_yield = self.request.query_params.get('min_yield', None)
            min_quality = self.request.query_params.get('min_quality', None)
            min_risk = self.request.query_params.get('min_risk', None)
            min_fair_value = self.request.query_params.get('min_fair_value', None)
            max_industry_rank = self.request.query_params.get('max_industry_rank', None)
            min_insider_rating = self.request.query_params.get('min_insider_rating', None)
            min_inst_rating = self.request.query_params.get('min_inst_rating', None)
            queryset = FinalCSV.objects.all()
            queryset = self.apply_filters(queryset, min_health, min_yield, min_quality, min_risk, min_fair_value, max_industry_rank, min_insider_rating, min_inst_rating)
            serializer = TableSerializer(queryset, many=True)
            return Response(serializer.data)

        

class PortfolioViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = PortfolioSerializer

    def create(self, request):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        print(queryset_token.values()[0]['user_id'])
        request.data['user'] = User(pk=queryset_token.values()[0]['user_id'])
        p = Portfolio(**request.data)
        p.save()
        p_serializer = PortfolioSerializer(p)
        return Response(p_serializer.data)

    def get_queryset(self):
        token = self.request.query_params.get('token', None)
        queryset_token = Token.objects.filter(key=token)
        queryset = Portfolio.objects.filter(user=queryset_token.values()[0]['user_id'])
        return queryset
        
    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        portfolio_name = kwargs['pk']
        queryset_token = Token.objects.filter(key=token)
        queryset = Portfolio.objects.filter(user=queryset_token.values()[0]['user_id'], portfolio_name=portfolio_name)
        serializer = PortfolioSerializer(queryset, many=True)
        return Response(serializer.data)



class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self, token):
        queryset_token = Token.objects.filter(key=token)
        try:
            return User.objects.get(id=queryset_token.values()[0]['user_id'])
        except Exception as e:
            return Response({'message':str(e)})

    def retrieve(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = UserSerializer(user)
        return Response(serializer.data) 
    
    def list(self, request, *args, **kwargs):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self,request,format=None):
        token = self.request.query_params.get('token', None)
        user = self.get_queryset(token) 
        serializer = self.serializer_class(user,data=request.data)

        if serializer.is_valid():            
            serializer.save()
            user.set_password(serializer.data.get('password'))
            user.save()
            return Response(serializer.data)    
        return Response({'message':True})
    

class PortfolioStatsViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = PortfolioStatsSerializer
    queryset = PortfolioStats.objects.all()

    def create(self, request, *args, **kwargs):
        
        token = self.request.query_params.get('token', None)
        action = self.request.query_params.get('action', None)
        portfolio_name = self.request.query_params.get('portfolio_name', None)
        queryset_token = Token.objects.filter(key=token)
        queryset = PortfolioStats.objects.filter(name=Portfolio(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name))
        serializer = PortfolioStatsSerializer(queryset, many=True)
        if action=='execute':
            if 'code' in request.data:
                TDSession = TDClientAuth(
                user=queryset_token.values()[0]['user_id'],
                client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
                redirect_uri='https://127.0.0.1:3000/portfolios/',
                )
                return_state = TDSession.login_from_code(request.data['code'])
                constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                modify_cons = queryset.values()[0]['execute_portfolio']
                if modify_cons:
                    for key in modify_cons:
                        constituents.loc[constituents['ticker_name']==key, 'shares'] = float(modify_cons[key])
                accounts = TDSession.get_accounts(
                account='all',
                fields=['positions']
                )
                accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                order_message = 'orders placed'
                for key, row in constituents.iterrows():
                    order = {
                            "orderType": "MARKET",
                            "session": "NORMAL",
                            "duration": "DAY",
                            "orderStrategyType": "SINGLE",
                            "orderLegCollection": [{
                                    "instruction": "Buy",
                                    "quantity": row['shares'],
                                    "instrument": {
                                        "symbol": row['ticker'],
                                        "assetType": "EQUITY"
                                    }
                                    }]
                            }
                    try:
                        TDSession.place_order(accountId, order)
                    except:
                        order_message = 'some orders not placed'
                orders = TDSession.get_accounts(
                account=accountId,
                fields=['orders']
                )
                orders_df = pd.DataFrame(orders['securitiesAccount']['orderStrategies'])
                orders_df.loc[:, 'orderDetails'] = orders_df.orderLegCollection.map(lambda x: x[0])
                orders_df = pd.concat([orders_df, orders_df['orderDetails'].apply(pd.Series)], axis=1)
                print(orders_df.columns.tolist())
                p_queryset = Portfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                p_queryset.execute_code= 1
                p_queryset.save()
                return Response({'message':return_state, "orders": orders_df[['orderId','session','duration','orderType','instrument','instruction','quantity','filledQuantity','status','enteredTime']].to_dict('records'), "order_message": order_message})
            else:
                TDSession = TDClientAuth(
                user=queryset_token.values()[0]['user_id'],
                client_id='BEBFCA5ZNBRXU4A60TP54AXWTEQQCHNS',
                redirect_uri='https://127.0.0.1:3000/portfolios/',
                )
                return_state = TDSession.login_from_file()
                print(return_state)
                if(not return_state):
                    p_queryset = Portfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                    p_queryset.execute_code= 2
                    p_queryset.save()
                    return Response({'message':return_state})
                else:
                    
                    constituents = pd.DataFrame(queryset.values()[0]['portfolio_constituents'])
                    modify_cons = request.data['execute_portfolio']
                    if modify_cons:
                        for key in modify_cons:
                            constituents.loc[constituents['ticker_name']==key, 'shares'] = float(modify_cons[key])
                    accounts = TDSession.get_accounts(
                    account='all',
                    fields=['positions']
                    )
                    accountId = (pd.DataFrame(accounts)['securitiesAccount'][0]['accountId'])
                    order_message = 'orders placed'
                    for key, row in constituents.iterrows():
                        order = {
                                "orderType": "MARKET",
                                "session": "NORMAL",
                                "duration": "DAY",
                                "orderStrategyType": "SINGLE",
                                "orderLegCollection": [{
                                        "instruction": "Buy",
                                        "quantity": row['shares'],
                                        "instrument": {
                                            "symbol": row['ticker'],
                                            "assetType": "EQUITY"
                                        }
                                        }]
                                }
                        try:
                            TDSession.place_order(accountId, order)
                        except:
                            order_message = 'some orders not placed'
                    orders = TDSession.get_accounts(
                    account=accountId,
                    fields=['orders']
                    )
                    orders_df = pd.DataFrame(orders['securitiesAccount']['orderStrategies'])
                    orders_df.loc[:, 'orderDetails'] = orders_df.orderLegCollection.map(lambda x: x[0])
                    orders_df = pd.concat([orders_df, orders_df['orderDetails'].apply(pd.Series)], axis=1)
                    orders_df = pd.concat([orders_df, orders_df['instrument'].apply(pd.Series)], axis=1)
                    p_queryset = Portfolio.objects.get(user=User(id=queryset_token.values()[0]['user_id']), portfolio_name=portfolio_name)
                    p_queryset.execute_code= 1
                    p_queryset.save()
                    return Response({'message':return_state, "orders": orders_df[['orderId','session','duration','orderType','symbol','instruction','quantity','filledQuantity','status','enteredTime']].to_dict('records'), "order_message": order_message})
                
                query=queryset.values()[0]
                query['execute_portfolio']= request.data['execute_portfolio']
                ps = PortfolioStats(**query)
                ps.save()
           
            
            
        return Response(serializer.data)