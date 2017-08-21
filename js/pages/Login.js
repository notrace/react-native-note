'use strict';
import React, {Component,PropTypes} from 'react';
import{ 
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Platform,
    NativeModules,
    ToastAndroid,
} from 'react-native';

import Register from './Register';
import ResetPwd from  './ResetPwd';
import { Redirect } from 'react-router-native'
import ShortLineTwo from '../component/ShortLineTwo';
var EncryptionModule = NativeModules.EncryptionModule;

import Loading from '../component/Loading_DD';

import { connect } from 'react-redux';
import { receiveLoginResult } from '../actions/LoginAction'
import { performGetAction } from '../actions/UserAction'
import { performUpdatePhone } from '../actions/PhoneAction'

import ApiUtils from '../util/ApiUtils'
import { toastShort } from '../util/ToastUtil';

var username = '';
var password = '';
var REQUEST_URL = ApiUtils.getUrl() + '/auth/sign_in';

class Login extends Component {
  constructor(props) {
    
    super(props);
    this.buttonBackAction=this.buttonBackAction.bind(this);    
    this.buttonRegisterOrLoginAction=this.buttonRegisterOrLoginAction.bind(this);  
    this.buttonChangeState=this.buttonChangeState.bind(this);
    this.findPwdAction=this.findPwdAction.bind(this);
    this.thirdPartLoginAction=this.thirdPartLoginAction.bind(this);
    this.state = {
      formReady: false,
      gotoResetPwd: false,
      loading: false,
    };

}
  //返回
  buttonBackAction(){
      const {navigator} = this.props;
      // return NaviGoBack(navigator);
  }
  //用户登录/注册
  buttonRegisterOrLoginAction(position){
    const {navigator,dispatch} = this.props;
    if(position === 0){
      //用户登录
      if(username === ''){
        toastShort('用户名不能为空...'); 
        return;
      }
      if(password === ''){
        toastShort('密码不能为空...');
        return;
      }
      // dispatch(performLoginAction(username,password));
      this.setState({
        loading: true,
      });
      fetch(REQUEST_URL,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;',
          'token-type': 'Bearer',
        },
        body: JSON.stringify({
          'phone': username,
          'password': password,
        })
      })
      .then((response) => response.json().then(json => ({ json, response })))
      .then(({json,response}) => {
        if (json.errors){
          toastShort(json.errors.join(","));
        }else{
          //登录成功..
          toastShort('登录成功...');
        }
        this.setState({
          loading: false,
        });
        dispatch(performUpdatePhone(username)); 
        dispatch(performGetAction(json));  
        var resultData = {};
        resultData= {
          authData: response,
          userData: json
        }
        dispatch(receiveLoginResult(resultData));
      }).catch((error)=> {
        this.setState({
          loading: false,
        });
        console.log(error);
        toastShort('服务器出错啦');
      });

      // EncryptionModule.MD5ByCallBack(password,(msg)=>{
      // dispatch(performLoginAction(username,msg));
      //   },(error)=>{
      //     // toastShort('密码加密失败...');
      // });

    }else if(position === 1){
    //用户注册
      InteractionManager.runAfterInteractions(() => {
        navigator.push({
          component: Register,
          name: 'Register'
        });
      });
    }
  }
  buttonChangeState(){
      
  }
  findPwdAction(){
    this.setState({ gotoResetPwd: true })
     // const {navigator} = this.props;
     // InteractionManager.runAfterInteractions(() => {
     //           navigator.push({
     //               component: ResetPwd,
     //               name: 'ResetPwd'
     //            });
     //        });
  }
  thirdPartLoginAction(position){
        
  }

  _renderLoginBtn(){
    if(this.state.formReady){
      var btnStyle = styles.loginBtn;
      var btnDisabled = false;
    }else{
      var btnStyle = [styles.loginBtn, styles.disabledBtn];
      var btnDisabled = true;
    }
    return(
      <View style={styles.loginBtnLine}>
        <TouchableOpacity onPress={() => {this.buttonRegisterOrLoginAction(0)}} 
          style={btnStyle}
          disabled={btnDisabled}>
          <Text style={styles.primaryBtnText}>登录</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {login, phone} = this.props;
    username = username || phone.phoneNum;
    if(login.authData.ok){
      return(
        <Redirect to={'/'}/>
      )
    }
    if(this.state.gotoResetPwd){
      return(
        <Redirect to={'/ResetPwd'}/>
      )
    }

    return (
      <View style={styles.loginPage}>
        <View style={styles.authForm} >
          <View style={[styles.authFormGroup, styles.bottomLine]}>
            <Image source={require('../../res/images/icon/phone.png')} 
                   style={styles.authTextIcon}/>
            <TextInput 
              style={styles.authTextField}
              placeholder="请输入注册手机号"
              placeholderTextColor="#C0C0C0"
              underlineColorAndroid="transparent"
              numberOfLines={1}
              ref={'username'}
              multiline={false}
              keyboardType='numeric'
              autoFocus={true}
              defaultValue={phone.phoneNum}
              onChangeText={(text) => {
                username = text;
                if(password != "" && username != ""){
                  this.setState({ formReady: true })
                }else{
                  this.setState({ formReady: false })
                }
              }}
            />
          </View>
          <View style={styles.authFormGroup}>
            <Image source={require('../../res/images/icon/pwd.png')} 
                   style={styles.authTextIcon}/>
            <TextInput 
              style={styles.authTextField}
              placeholder="请输入登录密码"
              placeholderTextColor="#C0C0C0"
              underlineColorAndroid="transparent"
              numberOfLines={1}
              ref={'password'}
              multiline={false}
              secureTextEntry={true}
              onChangeText={(text) => {
                password = text;
                if(password != "" && username != ""){
                  this.setState({ formReady: true })
                }else{
                  this.setState({ formReady: false })
                }
              }}/>
          </View>
        </View>
        <View style={{alignItems:'flex-end',marginTop:13}}>
          <TouchableOpacity onPress={()=>{this.findPwdAction()}} style={{marginRight:10}}>
            <Text style={styles.forgotPwd}>忘记密码</Text>
          </TouchableOpacity>
        </View>
        {this._renderLoginBtn()}
        <Loading visible={this.state.loading} />
      </View>
      );
    }
}
const styles=StyleSheet.create({
  loginPage:{
    marginTop:68,
    backgroundColor:'#f5f5f5',
    flex:1
  },
  bottomLine:{
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  authForm: {
    marginTop: 15,
    backgroundColor:'white',
    justifyContent: 'center',
  },
  authFormGroup:{
    marginLeft:15,
    flexDirection:'row',
    height:45,
    alignItems:'center'
  },
  authTextIcon:{
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  authTextField:{
    height:45,
    marginLeft: 5,
    fontSize: 15,
    textAlign: 'left',
    textAlignVertical:'center',
    flex:1,
    color:"#606060",
  },
  forgotPwd:{
    fontSize:13,
    color:'#24AE95'
  },
  loginBtnLine:{
    flexDirection:"row",
    justifyContent:'center',
  },
  loginBtn: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(36,174,149,1)',
    borderRadius: 2,
    marginTop:40,
    height: 40,
    width: 200,
  },
  disabledBtn:{
    backgroundColor: 'rgba(36,174,149,0.4)',
  },
  primaryBtnText:{
    color: 'white',
    fontSize: 18,
  }
});

function mapStateToProps(state) {
  const { login, phone } = state;
  return {
    login,
    phone
  }
}

export default connect(mapStateToProps)(Login);