import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import Report from "./Report";
import { Redirect } from "react-router-dom";

import { ChevronDown } from "react-feather";
import {
  Card,
  CardImg,
  CardTitle,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Col,
  Spinner,
  Container,
  Row
} from "reactstrap";


class ApexCharts extends React.Component {
  state = {
    articles: [],
    docs: [],
    buy_value: [],
    sell_value: [],
    top10_buys: [],
    top10_sells: [],
    net_inst_by_date: [],
    top10_inst: [],
    net_inst_value: [],
    wealth_graph: [],
    isPostLoading: true
  }
  getShares = (net_inst_by_date) => {
    let net_inst_by_date_shr = []
      for (let i=0;i<net_inst_by_date.length;i++){
          if(net_inst_by_date[i].securitytype==="SHR"){
          net_inst_by_date_shr.push(net_inst_by_date[i]);
        }

      }
      return net_inst_by_date_shr

  }

  fetchArticles = () => {
    const articleID = this.props.match.params.articleID;
    axios.get(`https://theopenstreet.com/api/matrix/${articleID}/`)
      .then(res => {
        this.setState({
          articles: res.data,
          wealth_graph: (res.data.wealth_graph),
          buy_value: (res.data.buy_value),
          sell_value: (res.data.sell_value),
          top10_buys: (res.data.top10_buys),
          top10_sells: (res.data.top10_sells),
          net_inst_by_date: this.getShares(res.data.net_inst_by_date),
          top10_inst: (res.data.top10_inst),
          net_inst_value: (res.data.net_inst_value)

        });

      });
  }

  

  componentDidMount() {
    this.fetchArticles();
  }

  render() {
    
    if (!this.props.token) {
      return <Redirect to="/" />;
    }

    
    if (this.state.docs.length === 0 & this.state.isPostLoading === false) {
      this.setState({isPostLoading: true});
    }
    if (this.state.docs.length !== 0 & this.state.isPostLoading === true) {
      this.setState({isPostLoading: false})
    }

    return (
    <React.Fragment>
      
      <Report data= {this.state.articles} buy_value = {this.state.buy_value} sell_value = {this.state.sell_value} top10_buys = {this.state.top10_buys} top10_sells = {this.state.top10_sells} net_inst_by_date = {this.state.net_inst_by_date} top10_inst = {this.state.top10_inst} net_inst_value = {this.state.net_inst_value} wealth_graph = {this.state.wealth_graph} />
      
        
        
        
    </React.Fragment>
    );
  }

}

const mapStatetoProps = state => {
  return {
    token: state.auth.token
  }
}


export default connect(mapStatetoProps)(ApexCharts);
