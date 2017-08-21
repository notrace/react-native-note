/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import { Redirect } from 'react-router-native'

import GlobalStyles from '../util/GlobalStyles.js'
import FormUtils from '../util/FormUtils.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'
import { receiveLoginResult } from '../actions/LoginAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import { toastShort } from '../util/ToastUtil';

var UPDATE_PASSWORD_URL = ApiUtils.getUrl() + '/auth/password';
var oldPwd = '';
var newPwd = '';
var newPwdConfirmation = '';

class ChangePwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formReady: false,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  renderUpdateBtn(){
    return(
      <TouchableOpacity onPress={() => {this.updatePwdAction()}} style={styles.updatebtn}>
        <Text style={styles.updateText}>确认修改</Text>
      </TouchableOpacity>
    )
  }

  updatePwdAction(){
    const {login, dispatch} = this.props;
    fetch(UPDATE_PASSWORD_URL,{
      method: 'PUT',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify({
          'old_password': oldPwd,
          'password': newPwd,
          'password_confirmation': newPwdConfirmation,        
        }
      )
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        var resultData = {};
        resultData= {
          authData: response,
          userData: json
        }
        dispatch(receiveLoginResult(resultData));
        toastShort('密码修改成功');
        this.onBack();
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  textFieldChange(name, value){
    switch(name){
      case 'oldPwd' : 
        oldPwd = value;
        break;
      case 'newPwd' : 
        newPwd = value;
        break;
      case 'newPwdConfirmation' : 
        newPwdConfirmation = value;
        break;
    }
  }

  render() {
    const {user} = this.props;
    var person = user.userData.data.person ;
    var optionStyle = GlobalStyles.bottomLine ;
    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getNavBar(()=>this.onBack(), '修改密码')}
        <View style={styles.textForm} >
          {FormUtils.textField('旧密码', '请输入旧密码', (text) => {this.textFieldChange('oldPwd', text)}, GlobalStyles.bottomLine)}
          {FormUtils.textField('新密码', '请输入6-16位字母和数字', (text) => {this.textFieldChange('newPwd', text)}, GlobalStyles.bottomLine)}
          {FormUtils.textField('确认密码', '请再次输入新密码', (text) => {this.textFieldChange('newPwdConfirmation', text)})}
        </View>
        {this.renderUpdateBtn()}
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
  settingGroup:{
    flexDirection: 'column',
    marginTop: 0,
  },
  textForm: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
    marginTop: 15,
    backgroundColor: 'white',
  },
  contentMargin:{
    fontSize: 14,
    color: 'red',
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  updatebtn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    marginTop:30,
    height: 46,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  updateText:{
    color: '#24AE95',
    fontSize: 18,
  },
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(ChangePwd);