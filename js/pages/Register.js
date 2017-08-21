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
import { performSaveLoginDataAction } from '../actions/LoginAction'

import ApiUtils from '../util/ApiUtils'
import { toastShort } from '../util/ToastUtil';

var REQUEST_URL = ApiUtils.getUrl() + '/auth';
var CODE_REQUEST_URL = ApiUtils.getUrl() + '/get_security_code';

import { performUpdatePhone } from '../actions/PhoneAction'


var username = '';
var password = '';
var verifyCode = '';
class Login extends Component {
  constructor(props) {
      super(props);
      this.buttonBackAction=this.buttonBackAction.bind(this);    
      this.buttonChangeState=this.buttonChangeState.bind(this);
      this.registerAction=this.registerAction.bind(this);
    this.state = {
      formReady: false,
      phoneReady: false,
      registerResult: false,
      registerLoading: false,
      codeLoading: false,
      timerTitle: '获取验证码',
      counting: false,
      canSendCode: false,
      timerCount: 60,
    };
  }

  _countDownAction(){
    const codeTime = this.state.timerCount;
    this.interval = setInterval(() =>{
      const timer = this.state.timerCount - 1;
      if(timer===0){
        this.interval&&clearInterval(this.interval);
        this.setState({
          timerCount: codeTime,
          timerTitle: '获取验证码',
          counting: false,
          canSendCode: true
        })
      }else{
        console.log("---- timer ",timer);
        this.setState({
          timerCount:timer,
          timerTitle: `${timer}秒后重试`,
          canSendCode: false,
        })
      }
    },1000)
  }

  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.interval && clearTimeout(this.interval);
    console.log("----------register componentWillUnmount");
  }

  componentDidMount() {
    console.log("----------register componentDidMount");
  }
  
  //返回
  buttonBackAction(){
      // const {navigator} = this.props;
      // return NaviGoBack(navigator);
  }
  buttonChangeState(){
    
  }
  registerAction(){
    const {navigator,dispatch} = this.props;
    //用户登录
    if(username === ''){
           (Platform.OS === 'android') ? ToastAndroid.show('用户名不能为空...',ToastAndroid.SHORT) : ''; 
           return;
    }
    if(password === ''){
           (Platform.OS === 'android') ? ToastAndroid.show('密码不能为空...',ToastAndroid.SHORT) : ''; 
           return;
    }
    this.setState({
      registerLoading: true,
    })
    fetch(REQUEST_URL,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;',
        'token-type': 'Bearer',
      },
      body: JSON.stringify({
        'phone': username,
        'password': password,
        'password_confirmation': password,
        'code': verifyCode,
      })
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log(json);
      console.log(response);
      if(response.ok){
        var resultData = {};
        resultData= {
          authData: response,
          userData: json
        }
        dispatch(performUpdatePhone(username)); 
        dispatch(performSaveLoginDataAction(resultData));
        this.setState({
          registerResult: true,
          registerLoading: false,
        });   
      }else{
        if(json.errors.full_messages){
          toastShort(json.errors.full_messages.join(","));  
        }else{
          toastShort(json.errors.join(","));  
        }
        this.setState({
          registerLoading: false,
        });   
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
        this.setState({
          registerLoading: false,
        });  
    });
  }

  queryVerifyCode(){
    if(username === ''){
           (Platform.OS === 'android') ? ToastAndroid.show('用户名不能为空...',ToastAndroid.SHORT) : ''; 
           return;
    }
    this.setState({
      codeLoading: true,
      canSendCode: false,
    })
    fetch(CODE_REQUEST_URL+"?phone="+username,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;',
        'token-type': 'Bearer',
      }
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log(json);
      console.log(response);

      if(response.ok){
        toastShort('发送成功');
        this._countDownAction(); 
      }else{
        if(json.errors.full_messages){
          toastShort(json.errors.full_messages.join(","));  
        }else{
          toastShort(json.errors.join(","));  
        }
      }  
      this.setState({
        codeLoading: false,
      });
    }).catch((error)=> {
      toastShort('服务器出错啦');
        this.setState({
          registerLoading: false,
        });  
    });
  }

  _renderSubmitBtn(){
    if(this.state.formReady){
      var btnStyle = styles.loginBtn;
      var btnDisabled = false;
    }else{
      var btnStyle = [styles.loginBtn, styles.disabledBtn];
      var btnDisabled = true;
    }
    return(
      <View style={styles.loginBtnLine}>
        <TouchableOpacity onPress={() => {this.registerAction()}} 
          style={btnStyle}
          disabled={btnDisabled}>
          <Text style={styles.primaryBtnText}>注册</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderCodeBtn(){
    if(this.state.canSendCode){
      var btnStyle = styles.codeBtn;
      var canSendCode = true;
    }else{
      var btnStyle = [styles.codeBtn, styles.disabledCodeBtn];
      var canSendCode = false;
    }   
    return(
      <TouchableOpacity onPress={() => {this.queryVerifyCode()}} 
        style={btnStyle}
        disabled={!canSendCode}>
        <Text style={{color:'white'}}>{this.state.timerTitle}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {phone} = this.props;
    if(this.state.registerResult){
      return(
        <Redirect to={'/'}/>
      )
    }
    return (
      <View style={styles.loginPage}>
        <View style={styles.authForm} >
          <View style={[styles.authFormGroup, styles.bottomLine]}>
            <Image source={require('../../res/images/icon/phone.png')}
              resizeMode='contain'     
              style={styles.authTextIcon}/>
            <TextInput 
              style={styles.authTextField}
              placeholder="请输入注册手机号"
              placeholderTextColor="#C0C0C0"
              underlineColorAndroid="transparent"
              keyboardType={'numeric'}
              numberOfLines={1}
              ref={'username'}
              multiline={false}
              autoFocus={true}
              defaultValue={phone.phoneNum}
              onChangeText={(text) => {
                username = text;
                if(password != "" && username != "" && verifyCode != ""){
                  this.setState({ formReady: true })
                }else{
                  this.setState({ formReady: false })
                }
                if(username != ""){
                  this.setState({ canSendCode: true })
                }else{
                  this.setState({ canSendCode: false  })
                }
              }}
            />
          </View>
          <View style={[styles.authFormGroup, styles.bottomLine]}>
            <Image source={require('../../res/images/icon/code.png')} 
              resizeMode='contain'
              style={styles.authTextIcon}/>
            <TextInput 
              style={styles.authTextField}
              placeholder="请输入验证码"
              placeholderTextColor="#C0C0C0"
              underlineColorAndroid="transparent"
              keyboardType='numeric'
              numberOfLines={1}
              ref={'password'}
              multiline={false}
              onChangeText={(text) => {
                verifyCode = text;
                if(password != "" && username != ""){
                  this.setState({ formReady: true })
                }else{
                  this.setState({ formReady: false })
                }
              }}/>
            {this.renderCodeBtn()}
          </View>
          <View style={styles.authFormGroup}>
            <Image source={require('../../res/images/icon/pwd.png')} 
             resizeMode='contain'
             style={styles.authTextIcon}/>
            <TextInput 
              style={styles.authTextField}
              placeholder="6-16位字母和数字的登录密码"
              placeholderTextColor="#C0C0C0"
              underlineColorAndroid="transparent"
              numberOfLines={1}
              ref={'password'}
              multiline={false}
              secureTextEntry={true}
              onChangeText={(text) => {
                password = text;
                if(password != "" && username != "" && verifyCode != ""){
                  this.setState({ formReady: true })
                }else{
                  this.setState({ formReady: false })
                }
              }}/>
          </View>
        </View>
        <Text style={{marginTop:13,marginLeft:13,fontSize:12,color:'#777'}}>点击立即注册，即代表你同意《VC Box服务协议》</Text>
        {this._renderSubmitBtn()}
        <Loading visible={this.state.registerLoading} />
        <Loading visible={this.state.codeLoading} />
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
  codeBtn: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(36,174,149,1)',
    height: 45,
    width: 120,
  },
  disabledBtn:{
    backgroundColor: 'rgba(36,174,149,0.4)',
  },
  disabledCodeBtn:{
    backgroundColor: '#C0C0C0',
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
    phone,
  }
}

export default connect(mapStateToProps)(Login);