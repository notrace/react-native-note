/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Text,
  ListView,
  View,
} from 'react-native';

import CompanyCell from '../../CompanyCell';

import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performDeleteLoginDataAction } from '../actions/LoginAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import { toastShort } from '../util/ToastUtil';

var REQUEST_URL = ApiUtils.getUrl() + '/companies.json?collect=true';

class CollectCompany extends Component {
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

  fetchData() {
    this.setState({
      isLoading: true,
      isLoadingFail: false,
    });
    const {login} = this.props;
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData)
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

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
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
    var len = this.state.dataSource.getRowCount();
    console.log("-------");
    console.log(this.state.dataSource.getRowCount());
    if(len > 0){
      return(
        <View style={styles.settingContainer}>
          {ViewUtils.getNavBar(()=>this.onBack(), '我收藏的项目')}
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
        </View>
      )
    }else{
      return(
        <View style={styles.settingContainer}>
          {ViewUtils.getNavBar(()=>this.onBack(), '我收藏的项目')}
          <View style={styles.collectCompanyEmptyContain}>
            <View style={styles.collectCompanyEmptyLine} >
              <Image source={require('../../res/images/icon/collect_company_empty.png')} style={styles.collectCompanyEmptyImage}/>
            </View>
            <View style={{flexDirection: 'row',justifyContent: 'center',}}>
              <Text style={{color: '#404040',fontSize: 18,}}>您尚未收藏项目</Text>
            </View>
          </View>
        </View>
      )  
    }
  }
}

const styles = StyleSheet.create({
  settingContainer:{
    marginTop: (Platform.OS === 'ios') ? 20:0,
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  listView: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#f3f3f4',
  },
  collectCompanyEmptyContain:{
    flex: 1,
  },
  collectCompanyEmptyLine:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  collectCompanyEmptyImage:{
    width: 114,
    marginTop: 50,
    height: 200,
    resizeMode: 'contain',
  }
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(CollectCompany);