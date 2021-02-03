import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import { Link, Redirect } from "react-router-dom"
import { ChevronsRight, ChevronsLeft } from "react-feather"
import img1 from "../../../assets/img/pages/kb-article.jpg"
import "../../../assets/scss/pages/knowledge-base.scss"
import { connect } from "react-redux"
import classnames from "classnames"

class Question extends React.Component {
  state = {
    activeTab: "1"
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  render() {
    if (!this.props.token) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Row>
          <Col lg="3" md="5" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Topics</CardTitle>
              </CardHeader>
              <CardBody className="knowledge-base-category">
                <Nav pills vertical>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggleTab("1")
                      }}
                    >Company Health
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggleTab("2")
                      }}
                    >Company Yield
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3"
                      })}
                      onClick={() => {
                        this.toggleTab("3")
                      }}
                    >Company Quality
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "4"
                      })}
                      onClick={() => {
                        this.toggleTab("4")
                      }}
                    >Industry Rank
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "5"
                      })}
                      onClick={() => {
                        this.toggleTab("5")
                      }}
                    >Fair Value
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "6"
                      })}
                      onClick={() => {
                        this.toggleTab("6")
                      }}
                    >Risk
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "7"
                      })}
                      onClick={() => {
                        this.toggleTab("7")
                      }}
                    >Insider Analysis
                    </NavLink>
                  </NavItem>                 
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "8"
                      })}
                      onClick={() => {
                        this.toggleTab("8")
                      }}
                    >Institutional Analysis
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </Card>
          </Col>
          <Col lg="9" md="7" sm="12">
            <TabContent activeTab={this.state.activeTab} className="mt-1">
              <TabPane tabId="1">
                <Card>
                  <CardHeader>
                    <h1>Company Health</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Company health helps assess the company’s good standing. <b>OpenStreet</b> examines:
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          5yr Revenue Growth calculated as an increase in sales in one year compared to sales of a previous year averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Uncertainty in Revenue Growth measures annualized volatility in revenue growth
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          5yr Average Profit Margin represents the percentage of sales turned into profits, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          5yr Average Market Share growth is the percent of total sales in an industry generated by this particular company, averaged over 5 years
                        </span>
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="2">
                <Card>
                  <CardHeader>
                    <h1>Company Yield</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Company yield helps assess the company’s cash flow and how it decides to distribute yields among shareholders. <b>OpenStreet</b> examines:
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          The 5yr Average Dividend Yield, expressed as a percentage, shows how much the company pays out in dividends each year, relative to its stock price, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          A 5yr Average Earnings Yield refers to the earnings per share for the most recent 12-month period, divided by the current market price per share, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          The 5yr Average Dividend Payout Ratio is the comparative ratio of the total amount of dividends paid out to shareholders relative to net income, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          A 5yr Average Free Cash Flow (FCF) represents the cash a company generates after accounting for cash outflows to support operations and maintain its capital assets, averaged over 5 years
                        </span>
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="3">
                <Card>
                  <CardHeader>
                    <h1>Company Quality</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Company quality helps assess the company’s debt levels and return on equity. <b>OpenStreet</b> examines:
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          The 5yr Average Debt-to-Equity (D/E) ratio, calculated by dividing a company’s total liabilities by its shareholder equity, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          A 5yr Average Return on Invested Capital (ROIC) is a calculation used to assess efficiency at allocating the capital under the company’s control toward profitable investments, averaged over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          The 5yr Average Growth in Return on Equity (ROE) measures financial performance calculated by dividing net income by shareholder’s equity. OpenStreet calculates y-o-y growth and averages over 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Uncertainty in ROE Growth measures the annualized volatility in ROE growth
                        </span>
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="4">
                <Card>
                  <CardHeader>
                    <h1>Industry Rank</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Industry Rank helps assess how the company is fairing compared to its peers in the same industry. <b>OpenStreet</b> examines Value, Quality and Profitability to rank the stocks.
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Value considers book-to-price, sales-to-price, and free cash flow
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Quality considers return on equity, equity-to-debt, and return on invested capital
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Profitability considers earnings yield and net profit margin
                        </span>
                      </li>
                    </ul>
                    <p>
                      Factors capture risk premia i.e., stocks and portfolios that historically demonstrate excess market returns in the long-term. These transparent, rules-based systems can help screen specific stocks with favorable characteristics. Backed by powerful empirical results, the industry rank factor provides replicability, simple implementation, and works for traditional active and passive mandates.
                    </p>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="5">
                <Card>
                  <CardHeader>
                    <h1>Fair Value</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Fair Value helps assess the fair price of the company’s stock. <b>OpenStreet</b> employs two methods:
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Fair Value by Dividend Discount Model (DDM) based on the present value of expected dividends, adjusted for growth and volatility. The DDM model discounts expected future dividends to present values, thus estimating if shares are over or undervalued.
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Fair Value by Free Cash Flow Model (FCFM) uses the company’s intrinsic value as equal to the present value of free cash flow. The net cash flow available for distribution to stockholders, adjusted for growth and volatility
                        </span>
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="6">
                <Card>
                  <CardHeader>
                    <h1>Risk</h1>
                  </CardHeader>
                  <CardBody>
                    <img
                      src={img1}
                      alt="article img"
                      className="img-fluid rounded-sm mb-1 w-100"
                    />
                    <p>
                      Risk helps assess the uncertainty of the company’s stock price.
                    </p>
                    <ul className="article-question p-0 list-unstyled">
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Annualized Volatility is the annualized uncertainty in price movements
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Max Drawdown is the maximum downward movement over past 5 years
                        </span>
                      </li>
                      <li>
                        <ChevronsRight size={16} />
                        <span className="align-middle">
                          Correlation with Market is how closely the company’s stock tracks market movements
                        </span>
                      </li>
                    </ul>
                    <p>
                      Track market risk to determine if other prospective shareholders might be willing to offer less to own a stock than your offer. Protect yourself from this risk by owning stocks with historically smaller drawdowns and less correlation with the market as a whole.
                    </p>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="7">
                <Card>
                  <CardHeader>
                    <h1>Insider Analysis</h1>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Insider Analysis provides the top 10 insider trades on the buy and sell-side and the trend in aggregate insider trades.
                    </p>
                    <p>
                      Academic studies with US data suggest insiders can earn above-normal profits on trades. Findings suggest that company insiders may be better informed than average investors about their firms’ prospects.
                    </p>
                    <p>
                      Lakonishok and Lee, “Are Insider Trades Informative?” The Review of Financial Studies, spring 2001
                    </p>
                  </CardBody>
                </Card>
              </TabPane>
              <TabPane tabId="8">
                <Card>
                  <CardHeader>
                    <h1>Institutional Analysis</h1>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Institutional Analysis provides the aggregate institutional holdings by security type and the trend in institutional shares held. It also provides details of the top 10 institutions holding that company’s stock.
                    </p>
                    <p>
                      Tracking and analyzing the flow of institutional funds into the company’s stock provides potentially profitable insights into where “smart money” is investing.
                    </p>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}



const mapStatetoProps = state => {
  return {
    token: state.auth.token
  }
}

export default connect(mapStatetoProps)(Question)

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import { Link } from "react-router-dom"
import { ChevronsRight, ChevronsLeft } from "react-feather"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import img1 from "../../../assets/img/pages/kb-article.jpg"
import "../../../assets/scss/pages/knowledge-base.scss"
class Question extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Question"
          breadCrumbParent="Pages"
          breadCrumbParent2="Knowledge Base"
          breadCrumbParent3="Content"
          breadCrumbActive="Question"
        />
        <Row>
          <Col lg="3" md="5" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Related Questions</CardTitle>
              </CardHeader>
              <CardBody className="knowledge-base-category">
                <ListGroup flush>
                  <ListGroupItem tag="a" href="#">
                    Cake icing gummi bears?
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#">
                    Jelly soufflÃ© apple pie?
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#">
                    SoufflÃ© apple pie ice cream cotton?
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#">
                    Powder wafer brownie?
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#">
                    Toffee donut dragÃ©e cotton candy?
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#">
                    SoufflÃ© chupa chups chocolate bar?
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg="9" md="7" sm="12">
            <Card>
              <CardHeader>
                <h1>Dessert halvah carrot cake sweet?</h1>
                <p>Last updated on 10 Dec 2018</p>
              </CardHeader>
              <CardBody>
                <p>
                  Pastry jelly chocolate bar caramels fruitcake gummies
                  marshmallow lemon drops. Powder cupcake topping muffin carrot
                  cake croissant soufflÃ© sugar plum sweet roll. Cotton candy ice
                  cream gummies biscuit bonbon biscuit. Icing pastry bonbon.
                  Sweet roll chocolate cake liquorice jelly beans caramels jelly
                  cookie caramels. Pastry candy canes cake powder lollipop
                  tootsie roll sugar plum. Cake cotton candy dragÃ©e danish.
                  Muffin croissant sweet roll candy wafer marzipan cheesecake.
                  Carrot cake toffee gummi bears gingerbread donut biscuit.
                  Donut chupa chups oat cake cheesecake apple pie gummies
                  marzipan icing cake. Macaroon jelly beans gummi bears carrot
                  cake tiramisu liquorice. Sweet tootsie roll cookie marzipan
                  brownie icing cookie jelly tart. Lollipop cookie tootsie roll
                  candy canes.
                </p>
                <img
                  src={img1}
                  alt="article img"
                  className="img-fluid rounded-sm mb-1 w-100"
                />
                <p>
                  Candy canes oat cake biscuit halvah ice cream. Marshmallow
                  icing topping toffee caramels dessert carrot cake. Liquorice
                  soufflÃ© brownie sugar plum dessert cotton candy. Cupcake
                  halvah topping oat cake soufflÃ© pastry dragÃ©e pudding cotton
                  candy.
                </p>
                <h5 className="mb-1">Topics:</h5>
                <ul className="article-question p-0 list-unstyled">
                  <li>
                    <ChevronsRight size={16} />
                    <span className="align-middle">
                      Pastry jelly chocolate bar caramels
                    </span>
                  </li>
                  <li>
                    <ChevronsRight size={16} />
                    <span className="align-middle">
                      Donut chupa chups oat cake
                    </span>
                  </li>
                  <li>
                    <ChevronsRight size={16} />
                    <span className="align-middle">
                      Marshmallow icing topping toffee caramels dessert carrot
                      cake
                    </span>
                  </li>
                </ul>
                <p className="mt-2">
                  Chocolate cake powder I love jelly beans lemon drops candy
                  fruitcake. Sesame snaps sugar plum chocolate candy canes
                  muffin. Wafer pastry topping croissant pudding dessert I love.
                  Bonbon apple pie fruitcake candy canes I love. Lollipop sweet
                  gingerbread I love I love dessert. I love halvah marshmallow
                  pie jelly beans macaroon candy. Bonbon ice cream lollipop pie
                  fruitcake oat cake. Topping marshmallow I love sesame snaps
                  dragÃ©e. I love sesame snaps jelly. Chocolate sesame snaps
                  jelly I love I love powder jelly-o.
                </p>
                <div className="d-flex justify-content-between mt-2">
                  <Link to="#">
                    <ChevronsLeft size={15} />
                    <span className="align-middle">Previous Article</span>
                  </Link>
                  <Link to="#">
                    <span className="align-middle">Next Article</span>
                    <ChevronsRight size={15} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default Question
