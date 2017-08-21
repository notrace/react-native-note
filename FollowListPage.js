/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  RefreshControl,
  TouchableOpacity,
  ListView,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import CompanyCell from './CompanyCell';
import ApiUtils from './js/util/ApiUtils'
import { toastShort } from './js/util/ToastUtil';
import { connect } from 'react-redux';


var REQUEST_URL = ApiUtils.getUrl() + '/companies.json';

class FollowListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLoading: false,
      isLoadingFail: false,
    };

    this.fetchData = this.fetchData.bind(this);
    
  }
  componentDidMount() {
    this.fetchData();  
  }

  componentWillReceiveProps(nextProps) {
    this.onRefresh();
  }

  fetchData() {
    this.setState({
      isLoading: true,
      isLoadingFail: false,
    });
    const {login} = this.props;
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData)
      // headers: {
      // 'Content-Type': 'application/json;',
      // 'token-type': 'Bearer',
      // 'access-token': login.authData.headers.map['access-token'][0],
      // 'client': login.authData.headers.map['client'][0],
      // 'expiry': login.authData.headers.map['expiry'][0],
      // 'uid': login.authData.headers.map['uid'][0],
      // },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.errors){
          this.setState({
            isLoading: false,
            isLoadingFail: false,
          });
          toastShort(responseData.errors.join(","));
        }else{
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData),
            isLoading: false,
            isLoadingFail: false,
          });
        }
      }).catch((error)=> {
        toastShort('服务器出错啦');
        this.setState({
          isLoading: false,
          isLoadingFail: true,
        });
      });
  }

  onRefresh() {
    this.fetchData();
  }

  renderShishen(shishen) {
    return (
      <CompanyCell key={shishen.id} shishen={shishen} {...this.props} />
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(e)=>this.renderShishen(e)}
        style={styles.listView} 
        enableEmptySections={true}
        refreshControl={
        <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={()=>this.onRefresh()}
            title="Loading..."
        />}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    flex: 1,
    marginVertical: 64,
    marginBottom: 0,
    backgroundColor: '#f3f3f4',
  },

});
function mapStateToProps(state) {
  const { login } = state;
  return {
    login
  }
}
export default connect(mapStateToProps)(FollowListPage);