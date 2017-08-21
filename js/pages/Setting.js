/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  ListView,
  Linking,
  PixelRatio,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import GlobalStyles from '../util/GlobalStyles.js'
// redux
import { connect } from 'react-redux';
import { performDeleteLoginDataAction } from '../actions/LoginAction'
import { performClearUserDataAction } from '../actions/UserAction'
import WebIMActions from '../easemob/Redux/WebIMRedux'
import MessageActions from '../easemob/Redux/MessageRedux'
import GroupActions from '../easemob/Redux/GroupRedux'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import Feedback from './Feedback';
import ChangePwd from './ChangePwd';
import AboutUs from './AboutUs';

import { toastShort } from '../util/ToastUtil';

const CONTACT_NUM = '400-222-2223';
// var REQUEST_URL = ApiUtils.getUrl() + '/auth/sign_out';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  logoutAction(){
    const {dispatch} = this.props;
    dispatch(MessageActions.clearMessage());
    dispatch(GroupActions.cleanGroup());
    dispatch(WebIMActions.logout());
    
    dispatch(performClearUserDataAction());
    dispatch(performDeleteLoginDataAction());
    
  }

  renderLogoutBtn(){
    return(
      <TouchableOpacity onPress={() => {this.logoutAction()}} style={styles.logoutbtn}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    )
  }

  onClick(tag){
    var redirect = true;
    switch(tag){
      case 'feedback' : 
        TargetComponent = Feedback;
        break;
      case 'changePwd' : 
        TargetComponent = ChangePwd;
        break;
      case 'aboutUs' : 
        TargetComponent = AboutUs;
        break;
      case 'contactUs' :
        redirect = false;
        var url = 'tel:' + CONTACT_NUM;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
    }
    if (TargetComponent && redirect) {
      this.props.navigator.push({
        component: TargetComponent,
      });
    }
  }

  render() {
    var borderSettingItemStyle = { borderBottomWidth: 0.5, borderColor: '#E0E0E0'};
    var optionTextStyle = {color:"#5EA4F7",fontSize: 17,}
    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getNavBar(()=>this.onBack(), '设置')}
          <View style={GlobalStyles.settingGroupContain}>
            {ViewUtils.getSettingItem(()=>this.onClick('feedback'), '意见反馈', null, borderSettingItemStyle)}
            {ViewUtils.getSettingItem(()=>this.onClick('changePwd'), '修改密码', null, borderSettingItemStyle)}
            {ViewUtils.getSettingItem(()=>this.onClick('aboutUs'), '关于我们', null)}
          </View>
          <View style={GlobalStyles.settingGroupContain}>
            {ViewUtils.getSettingItem(()=>this.onClick('contactUs'), '联系我们', null, null,CONTACT_NUM, optionTextStyle)}
          </View>
        {this.renderLogoutBtn()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  settingContainer:{
    marginTop: (Platform.OS === 'ios') ? 20:0,
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  logoutbtn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    marginTop:13,
    height: 46,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoutText:{
    color: '#24AE95',
    fontSize: 18,
  },
});
function mapStateToProps(state) {
  const { login } = state;
  return {
    login,
  }
}
export default connect(mapStateToProps)(Setting);