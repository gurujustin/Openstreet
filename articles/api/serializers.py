from rest_framework import serializers

from articles.models import FinalCSV, Portfolio, PortfolioStats, FinalCSVTable
from django.contrib.auth.models import User

class FinalCSVSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalCSV
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalCSV
        fields = ('key',
                'industry_rank', 
                'fair_value_score',
                'risk_score',
                'net_holding_pct',
                'net_value_executed_pct',
                'company_health',
                'company_yield',
                'company_quality',
                'ticker',
                'ticker_name')

class FinalCSVTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalCSVTable
        fields = '__all__'

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'

class PortfolioStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioStats
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name','last_name','username','password')