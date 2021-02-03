import React from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Col,
  FormGroup,
  Form,
  Spinner,
  Container,
  Row
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { ContextLayout } from "../../../utility/context/Layout";
import { ChevronDown } from "react-feather";
import axios from "axios";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { LoadingOutlined } from '@ant-design/icons';
import { List,Divider } from 'antd';
import * as Icon from 'react-feather';
import Tour, { STATUS } from "react-joyride"
import "../../../assets/scss/plugins/extensions/react-tour.scss"
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const isoCountries = {
  'AF' : 'Afghanistan',
  'AX' : 'Aland Islands',
  'AL' : 'Albania',
  'DZ' : 'Algeria',
  'AS' : 'American Samoa',
  'AD' : 'Andorra',
  'AO' : 'Angola',
  'AI' : 'Anguilla',
  'AQ' : 'Antarctica',
  'AG' : 'Antigua And Barbuda',
  'AR' : 'Argentina',
  'AM' : 'Armenia',
  'AW' : 'Aruba',
  'AU' : 'Australia',
  'AT' : 'Austria',
  'AZ' : 'Azerbaijan',
  'BS' : 'Bahamas',
  'BH' : 'Bahrain',
  'BD' : 'Bangladesh',
  'BB' : 'Barbados',
  'BY' : 'Belarus',
  'BE' : 'Belgium',
  'BZ' : 'Belize',
  'BJ' : 'Benin',
  'BM' : 'Bermuda',
  'BT' : 'Bhutan',
  'BO' : 'Bolivia',
  'BA' : 'Bosnia And Herzegovina',
  'BW' : 'Botswana',
  'BV' : 'Bouvet Island',
  'BR' : 'Brazil',
  'IO' : 'British Indian Ocean Territory',
  'BN' : 'Brunei Darussalam',
  'BG' : 'Bulgaria',
  'BF' : 'Burkina Faso',
  'BI' : 'Burundi',
  'KH' : 'Cambodia',
  'CM' : 'Cameroon',
  'CA' : 'Canada',
  'CV' : 'Cape Verde',
  'KY' : 'Cayman Islands',
  'CF' : 'Central African Republic',
  'TD' : 'Chad',
  'CL' : 'Chile',
  'CN' : 'China',
  'CX' : 'Christmas Island',
  'CC' : 'Cocos (Keeling) Islands',
  'CO' : 'Colombia',
  'KM' : 'Comoros',
  'CG' : 'Congo',
  'CD' : 'Congo, Democratic Republic',
  'CK' : 'Cook Islands',
  'CR' : 'Costa Rica',
  'CI' : 'Cote D\'Ivoire',
  'HR' : 'Croatia',
  'CU' : 'Cuba',
  'CY' : 'Cyprus',
  'CZ' : 'Czech Republic',
  'DK' : 'Denmark',
  'DJ' : 'Djibouti',
  'DM' : 'Dominica',
  'DO' : 'Dominican Republic',
  'EC' : 'Ecuador',
  'EG' : 'Egypt',
  'SV' : 'El Salvador',
  'GQ' : 'Equatorial Guinea',
  'ER' : 'Eritrea',
  'EE' : 'Estonia',
  'ET' : 'Ethiopia',
  'FK' : 'Falkland Islands (Malvinas)',
  'FO' : 'Faroe Islands',
  'FJ' : 'Fiji',
  'FI' : 'Finland',
  'FR' : 'France',
  'GF' : 'French Guiana',
  'PF' : 'French Polynesia',
  'TF' : 'French Southern Territories',
  'GA' : 'Gabon',
  'GM' : 'Gambia',
  'GE' : 'Georgia',
  'DE' : 'Germany',
  'GH' : 'Ghana',
  'GI' : 'Gibraltar',
  'GR' : 'Greece',
  'GL' : 'Greenland',
  'GD' : 'Grenada',
  'GP' : 'Guadeloupe',
  'GU' : 'Guam',
  'GT' : 'Guatemala',
  'GG' : 'Guernsey',
  'GN' : 'Guinea',
  'GW' : 'Guinea-Bissau',
  'GY' : 'Guyana',
  'HT' : 'Haiti',
  'HM' : 'Heard Island & Mcdonald Islands',
  'VA' : 'Holy See (Vatican City State)',
  'HN' : 'Honduras',
  'HK' : 'Hong Kong',
  'HU' : 'Hungary',
  'IS' : 'Iceland',
  'IN' : 'India',
  'ID' : 'Indonesia',
  'IR' : 'Iran, Islamic Republic Of',
  'IQ' : 'Iraq',
  'IE' : 'Ireland',
  'IM' : 'Isle Of Man',
  'IL' : 'Israel',
  'IT' : 'Italy',
  'JM' : 'Jamaica',
  'JP' : 'Japan',
  'JE' : 'Jersey',
  'JO' : 'Jordan',
  'KZ' : 'Kazakhstan',
  'KE' : 'Kenya',
  'KI' : 'Kiribati',
  'KR' : 'Korea',
  'KW' : 'Kuwait',
  'KG' : 'Kyrgyzstan',
  'LA' : 'Lao People\'s Democratic Republic',
  'LV' : 'Latvia',
  'LB' : 'Lebanon',
  'LS' : 'Lesotho',
  'LR' : 'Liberia',
  'LY' : 'Libyan Arab Jamahiriya',
  'LI' : 'Liechtenstein',
  'LT' : 'Lithuania',
  'LU' : 'Luxembourg',
  'MO' : 'Macao',
  'MK' : 'Macedonia',
  'MG' : 'Madagascar',
  'MW' : 'Malawi',
  'MY' : 'Malaysia',
  'MV' : 'Maldives',
  'ML' : 'Mali',
  'MT' : 'Malta',
  'MH' : 'Marshall Islands',
  'MQ' : 'Martinique',
  'MR' : 'Mauritania',
  'MU' : 'Mauritius',
  'YT' : 'Mayotte',
  'MX' : 'Mexico',
  'FM' : 'Micronesia, Federated States Of',
  'MD' : 'Moldova',
  'MC' : 'Monaco',
  'MN' : 'Mongolia',
  'ME' : 'Montenegro',
  'MS' : 'Montserrat',
  'MA' : 'Morocco',
  'MZ' : 'Mozambique',
  'MM' : 'Myanmar',
  'NA' : 'Namibia',
  'NR' : 'Nauru',
  'NP' : 'Nepal',
  'NL' : 'Netherlands',
  'AN' : 'Netherlands Antilles',
  'NC' : 'New Caledonia',
  'NZ' : 'New Zealand',
  'NI' : 'Nicaragua',
  'NE' : 'Niger',
  'NG' : 'Nigeria',
  'NU' : 'Niue',
  'NF' : 'Norfolk Island',
  'MP' : 'Northern Mariana Islands',
  'NO' : 'Norway',
  'OM' : 'Oman',
  'PK' : 'Pakistan',
  'PW' : 'Palau',
  'PS' : 'Palestinian Territory, Occupied',
  'PA' : 'Panama',
  'PG' : 'Papua New Guinea',
  'PY' : 'Paraguay',
  'PE' : 'Peru',
  'PH' : 'Philippines',
  'PN' : 'Pitcairn',
  'PL' : 'Poland',
  'PT' : 'Portugal',
  'PR' : 'Puerto Rico',
  'QA' : 'Qatar',
  'RE' : 'Reunion',
  'RO' : 'Romania',
  'RU' : 'Russian Federation',
  'RW' : 'Rwanda',
  'BL' : 'Saint Barthelemy',
  'SH' : 'Saint Helena',
  'KN' : 'Saint Kitts And Nevis',
  'LC' : 'Saint Lucia',
  'MF' : 'Saint Martin',
  'PM' : 'Saint Pierre And Miquelon',
  'VC' : 'Saint Vincent And Grenadines',
  'WS' : 'Samoa',
  'SM' : 'San Marino',
  'ST' : 'Sao Tome And Principe',
  'SA' : 'Saudi Arabia',
  'SN' : 'Senegal',
  'RS' : 'Serbia',
  'SC' : 'Seychelles',
  'SL' : 'Sierra Leone',
  'SG' : 'Singapore',
  'SK' : 'Slovakia',
  'SI' : 'Slovenia',
  'SB' : 'Solomon Islands',
  'SO' : 'Somalia',
  'ZA' : 'South Africa',
  'GS' : 'South Georgia And Sandwich Isl.',
  'ES' : 'Spain',
  'LK' : 'Sri Lanka',
  'SD' : 'Sudan',
  'SR' : 'Suriname',
  'SJ' : 'Svalbard And Jan Mayen',
  'SZ' : 'Swaziland',
  'SE' : 'Sweden',
  'CH' : 'Switzerland',
  'SY' : 'Syrian Arab Republic',
  'TW' : 'Taiwan',
  'TJ' : 'Tajikistan',
  'TZ' : 'Tanzania',
  'TH' : 'Thailand',
  'TL' : 'Timor-Leste',
  'TG' : 'Togo',
  'TK' : 'Tokelau',
  'TO' : 'Tonga',
  'TT' : 'Trinidad And Tobago',
  'TN' : 'Tunisia',
  'TR' : 'Turkey',
  'TM' : 'Turkmenistan',
  'TC' : 'Turks And Caicos Islands',
  'TV' : 'Tuvalu',
  'UG' : 'Uganda',
  'UA' : 'Ukraine',
  'AE' : 'United Arab Emirates',
  'GB' : 'United Kingdom',
  'US' : 'United States',
  'UM' : 'United States Outlying Islands',
  'UY' : 'Uruguay',
  'UZ' : 'Uzbekistan',
  'VU' : 'Vanuatu',
  'VE' : 'Venezuela',
  'VN' : 'Viet Nam',
  'VG' : 'Virgin Islands, British',
  'VI' : 'Virgin Islands, U.S.',
  'WF' : 'Wallis And Futuna',
  'EH' : 'Western Sahara',
  'YE' : 'Yemen',
  'ZM' : 'Zambia',
  'ZW' : 'Zimbabwe'
};

const getCountryName = (countryCode) => {
  if (isoCountries.hasOwnProperty(countryCode)) {
      return isoCountries[countryCode];
  } else {
      return countryCode;
  }
}
class AggridTable extends React.Component {
  state = {
    rowData: [],
    paginationPageSize: 20,
    name: "",
    docs: [],
    allocation: "",
    basicPicker: "",
    currenPageSize: "",
    getPageSize: "",
    isLoading: true,
    isPostLoading: true,
    searchText: '',
    company_health: "0",
    company_yield: "0",
    fair_value_score: "0",
    company_quality: "0",
    risk_score: "0",
    industry_rank: "100",
    net_value_executed_pct: "0",
    net_holding_pct: "0",
    isTouropen: false,
    defaultColDef: {
      sortable: true,
      editable: false,
      resizable: true,
      suppressMenu: true
    },
    columnDefs: [
      {
        headerName: "Ticker",
        field: "ticker",
        width: 100,
        cellRenderer: function (params) {
          let keyData = params.value;
          let newLink = `<a href="/articleview/${keyData}">${keyData}</a>`;
          return newLink;
        },
        filter: false,
      },
      {
        headerName: "Name",
        field: "ticker_name",
        filter: true,
        filterParams: {
          filterOptions: [
            'contains'
          ],
          suppressAndOrCondition: true,
        },
        width: 200,
        // pinned: window.innerWidth > 992 ? "left" : false
      },
      {
        headerName: "Health Rating",
        field: "company_health",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Yield Rating",
        field: "company_yield",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 140
      },
      {
        headerName: "Quality Rating",
        field: "company_quality",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Industry Rank",
        field: "industry_rank",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'lessThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 180
      },
      {
        headerName: "Fair Value Rating",
        field: "fair_value_score",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Risk Rating",
        field: "risk_score",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 140
      },
      {
        headerName: "Insider Rating",
        field: "net_value_executed_pct",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
      {
        headerName: "Institutional Rating",
        field: "net_holding_pct",
        filter: "agNumberColumnFilter",
        filterParams: {
          filterOptions: [
            'greaterThan'
          ],
          suppressAndOrCondition: true,
        },
        width: 200
      },
    ]
  }

  startTour = () => {
    this.setState({
      isTouropen: true
    })
  }

  fetchArticles = () => {
    axios.get('https://theopenstreet.com/api/matrix/?action=search')
      .then(res => {
        // console.log(res.data);
        let items = this.state;
        items['rowData'] = items['rowData'].concat(res.data);
        this.setState({ items });

      });
    let today = new Date();
    today.setDate(today.getDate() - 20);
    today = today.toISOString().slice(0, 10);
    axios.get(`http://api.datanews.io/v1/news?size=50&source=wsj.com&q=finance&apiKey=08qu938b4y5v8dem2w521v76v&from=${today}&sortBy=date&language=en&country=US`)
      .then(res => {
        let sorted = res.data['hits']
        this.setState({ docs: sorted });
        console.log(this.state.docs); 
      
      });
    
  }

  componentDidMount() {
    console.log(this.props.token)
    this.fetchArticles();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token) {
      this.fetchArticles();
    }
  }


  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages()
    })
  }

  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        currenPageSize: val,
        getPageSize: val
      })
    }
  }
  filter = (params) => {
    var model = this.gridApi.getFilterModel();
    let items = this.state;
    for (const field in model) {
      items[`${field}`] = `${model[field].filter}`;
    }
    this.setState({ items });
    console.log(this.state);
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    // console.log(this.state)
  }
  handleSubmit = event => {
    axios.post(`https://theopenstreet.com/api/portfolio/?token=${localStorage.getItem('token')}`, {
        portfolio_name: this.state.name,
        allocation: this.state.allocation,
        date_created: this.state.basicPicker[0].toISOString().split('T')[0],
        min_health: parseInt(this.state.company_health),
        min_yield: parseInt(this.state.company_yield),
        min_fair_value:parseInt(this.state.fair_value_score),
        min_quality: parseInt(this.state.company_quality),
        min_risk:parseInt(this.state.risk_score),
        max_industry_rank: parseInt(this.state.industry_rank),
        min_insider_rating:parseInt(this.state.net_value_executed_pct),
        min_inst_rating: parseInt(this.state.net_holding_pct),
      })
      this.props.history.push('/portfolios/');
  }
  render() {
    if (!this.props.token) {
      return <Redirect to="/" />;
    }
    const { rowData, columnDefs, defaultColDef, basicPicker } = this.state;
    if (this.state.rowData.length === 0 & this.state.isLoading === false) {
      let items = this.state;
      items['isLoading'] = true;
      this.setState({ items });
    }
    if (this.state.rowData.length !== 0 & this.state.isLoading === true) {
      let items = this.state;
      items['isLoading'] = false;
      this.setState({ items });
    }
    if (this.state.docs.length === 0 & this.state.isPostLoading === false) {
      this.setState({isPostLoading: true});
    }
    if (this.state.docs.length !== 0 & this.state.isPostLoading === true) {
      this.setState({isPostLoading: false})
    }
    const steps = [
      {
        target: ".ag-header-row:first-child> :first-child",
        content: "Ticker - Click on ticker to navigate to stock research report.",
        disableBeacon: true
      },
      {
        target: ".ag-header-row:first-child> :nth-child(3)",
        content: "Health Rating - Enter Filter Parameters to apply rules on the stock universe.",
        disableBeacon: true
      },
      {
        target: "[name=name]",
        content: "Generate Portfolio - Portfolio Name: Enter a name for the portfolio",
        disableBeacon: false
      },
      {
        target: "#allocation",
        content: "Generate Portfolio - Allocation: Enter an amount to allocate to the portfolio",
        disableBeacon: true
      },
      {
        target: "[placeholder=yyyy-mm-dd]",
        content: "Generate Portfolio - Effective Date: Enter a date on which you would like to apply the rules",
        disableBeacon: true
      },
      {
        target: ".applybtn",
        content: "Generate Portfolio - Hit Apply Rules to add the filter parameters to the portfolio rule list.",
        disableBeacon: true
      },
      {
        target: ".navbar-nav :first-child",
        content: "Dashboard - Click on Dashboard",
        disableBeacon: true
      },
      {
        target: ".navbar-nav li:nth-child(2)",
        content: "Portfolios - View and track your portfolios in this tab",
        disableBeacon: true
      }
    ]
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Tour
              disableOverlay
              steps={steps}
              run={this.state.isTouropen}
              continuous={true}
              showSkipButton={true}
              floaterProps={{ disableAnimation: true }}
              callback={data => {
                if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
                  this.setState({ isTouropen: false })
                }
              }}
            />
            <Card>
              <CardBody>
                <Button color="primary" outline onClick={this.startTour}>
                  Start Tour
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <List
          // itemLayout="horizontal"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          size="small"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={this.state.docs}

          renderItem={item => (
            <Card style={{marginLeft: 20, marginRight: 20}}>
              <CardImg
                className="img-fluid mb-2"
                src={item.imageUrl}
                alt="card image cap"
              />
                <Container>
                  <Row>
                    
                    <Col>
                      <a href={item.url}><h3>{item.title}</h3></a>
                      <Row>
                        <Col lg="5" sm="5" md="5" style={{paddingTop: 5}}>
                          <Icon.Clock size={15} style={{color: "white"}}/>
                          <label>{new Date(item.pubDate).toString().substring(4, 15)}</label>
                        </Col>
                        <Col lg="5" sm="5" style={{paddingTop: 5}}>
                          <Icon.User size={15} style={{color: "white"}}/>
                          <label>{item.authors[0]}</label>
                        </Col>
                        <Col lg="5" sm="5" style={{paddingTop: 5}}>
                          <Icon.Globe size={15} style={{color: "white"}}/>
                          <label>{getCountryName(item.country.toUpperCase())}</label>
                        </Col>
                        <Col lg="5" sm="5">
                          <img src={`https://www.google.com/s2/favicons?domain=${item.source}`} alt="No Image"/>
                          <label>{item.source.toUpperCase()}</label>
                        </Col>
                      </Row>
                      <Divider />
                      <p>{item.content.substring(0, 250)}...</p>
                    </Col>
                  </Row>
                
                </Container>
            </Card>
          )}
        />
        
        <Card style={{marginTop: 15}}>

          <CardHeader id="portgen">
            <CardTitle>
              <h4 style={{paddingBottom: 15}}>Portfolio Generation</h4>
            </CardTitle>

          </CardHeader>

          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="4">
                  <span>Portfolio Name</span>
                </Col>
                <Col md="6">
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.handleChange}

                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="4">
                  <span>Allocation</span>
                </Col>
                <Col md="6">
                  <Input
                    //  ref="sdf"
                    type="text"
                    name="allocation"
                    id="allocation"
                    onChange={this.handleChange}

                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="4">
                  <span>Effective Date</span>
                </Col>
                <Col md="6">
                  <Flatpickr
                    className="form-control"
                    value={basicPicker}
                    placeholder="yyyy-mm-dd"
                    onChange={date => {
                      this.setState({ basicPicker: date });
                    }}
                    options={{maxDate: new Date().fp_incr(-1) }}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md={{ size: 8, offset: 4 }}>
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1 applybtn"
                  >
                    Apply Rules
                  </Button.Ripple>
                  <Button.Ripple
                    outline
                    color="warning"
                    type="reset"
                    className="mb-1"
                  >
                    Reset
                  </Button.Ripple>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>

        </Card>
        <Card className="overflow-hidden agGrid-card">
        <CardTitle>
              <h4 style={{paddingTop: 20, paddingLeft: 20}}>Stock Ratings Matrix</h4>
            </CardTitle>
          
            
            
            <CardBody className="py-0">
              {this.state.rowData === null ? null : (
                <div className="ag-theme-material w-100 my-2 ag-grid-table">
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="mb-1">
                      <UncontrolledDropdown className="p-1 ag-dropdown">
                        <DropdownToggle tag="div">
                          {this.gridApi
                            ? this.state.currenPageSize
                            : "" * this.state.getPageSize -
                            (this.state.getPageSize - 1)}{" "}
                        -{" "}
                          {this.state.rowData.length -
                            this.state.currenPageSize * this.state.getPageSize >
                            0
                            ? this.state.currenPageSize * this.state.getPageSize
                            : this.state.rowData.length}{" "}
                        of {this.state.rowData.length}
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(20)}
                          >
                            20
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(50)}
                          >
                            50
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(100)}
                          >
                            100
                        </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(134)}
                          >
                            134
                        </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div className="d-flex flex-wrap justify-content-between mb-1">
                      <div className="table-input mr-1">
                        <Input
                          placeholder="search..."
                          onChange={e => this.updateSearchQuery(e.target.value)}
                          value={this.state.value}
                        />
                      </div>
                      <div className="export-btn">
                        <Button.Ripple
                          color="primary"
                          onClick={() => this.gridApi.exportDataAsCsv()}
                        >
                          Export as CSV
                      </Button.Ripple>
                      </div>
                    </div>
                  </div>
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={true}
                        onFilterChanged={this.filter}
                        pagination={true}
                        paginationPageSize={this.state.paginationPageSize}
                        pivotPanelShow="always"
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                </div>
              )}
            </CardBody>
        </Card>
      </React.Fragment>
    )
  }
}

const mapStatetoProps = state => {
  console.log(state)
  return {
    token: state.auth.token
  }
}


export default connect(mapStatetoProps)(AggridTable);
