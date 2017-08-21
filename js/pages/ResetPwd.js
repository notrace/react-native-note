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
import { Redirect } from 'react-router-native'
import ShortLineTwo from '../component/ShortLineTwo';
import { connect } from 'react-redux';
import Loading from '../component/Loading_DD';
import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';
import { toastShort } from '../util/ToastUtil';

var CODE_REQUEST_URL = ApiUtils.getUrl() + '/get_security_code';
var EDITPWD_REQUEST_URL = ApiUtils.getUrl() + '/auth/password/edit';
var FORGOT_REQUEST_URL = ApiUtils.getUrl() + '/auth/password';

// var UPDATE_REQUEST_URL = ApiUtils.getUrl() + '/forgot_password';


var EncryptionModule = NativeModules.EncryptionModule;

import { performUpdatePhone } from '../actions/PhoneAction'

var username = '';
var password = '';
var verifyCode = '';
var password_confirmation = '';

class ResetPwd extends Component {
  constructor(props) {
      super(props);
      // this.buttonBackAction=this.buttonBackAction.bind(this);    
      // this.buttonChangeState=this.buttonChangeState.bind(this);
      // this.registerAction=this.registerAction.bind(this);
    this.state = {
      editPwdFormReady: false,
      updatePwdFormReady: false,
      phoneReady: false,
      editPwdResult : false,
      editPwdLoading : false,
      updatePwdResult: false,
      updatePwdLoading: false,
      codeLoading: false,
      gotoLogin: false,
      resetTokenReady: false,
      resetToken: {},
      timerTitle: '获取验证码',
      counting: false,
      isPhoneExsit: false,
      canSendCode: true,
      waitingTime: false,
      timerCount: 60,
    };
  }

  _countDownAction(){
    const codeTime = this.state.timerCount;
    this.interval = setInterval(() =>{
      const timer = this.state.timerCount - 1
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
  }
  
  //返回
  buttonBackAction(){
    this.setState({
      gotoLogin: true,
    })
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
        this.setState({
          codeLoading: false,
        });   
      }else{
        toastShort(json.errors.join(","));
        this.setState({
          codeLoading: false,
        });
        this._countDownAction();
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
        this.setState({
          codeLoading: false,
        });
        this._countDownAction();
    });
  }

  editPwdAction(){
    //用户登录
    if(username === ''){
      (Platform.OS === 'android') ? ToastAndroid.show('用户名不能为空...',ToastAndroid.SHORT) : ''; 
      return;
    }
    if(verifyCode === ''){
      (Platform.OS === 'android') ? ToastAndroid.show('验证码不能为空...',ToastAndroid.SHORT) : ''; 
      return;
    }
    this.setState({
      registerLoading: true,
    })
    fetch(EDITPWD_REQUEST_URL + "?phone=" + username + "&code=" + verifyCode,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;',
        'token-type': 'Bearer',
      }
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        this.setState({
          editPwdResult: true,
          editPwdLoading: false,
          resetTokenReady: true,
          resetToken: ApiUtils.receveHeaders(response),
        });   
        this.refs['password'].clear();
        this.refs['password_confirmation'].clear();
      }else{
        toastShort(json.errors.join(","));
        this.setState({
          editPwdLoading: false,
        });  
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
        this.setState({
          editPwdLoading: false,
        });  
    });
  }

  updatePwdAction(){
    const {dispatch} = this.props;
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
     fetch(FORGOT_REQUEST_URL,{
      method: 'PUT',
      headers: this.state.resetToken,
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
        toastShort('密码修改成功，请登录');
        dispatch(performUpdatePhone(username)); 
        this.setState({
          updatePwdResult: true,
          updatePwdLoading: false,
          gotoLogin: true,
        });   
      }else{
        toastShort(json.errors.join(","));
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
      this.setState({
      });
    });
  }

  renderCodeBtn(){
    if(this.state.canSendCode && this.state.isPhoneExsit){
      var btnStyle = styles.codeBtn;
      var canSendCode = true;
    }else{
      var btnStyle = [styles.codeBtn, styles.disabledCodeBtn];
      var canSendCode = false;
    }
    return(
      <TouchableOpacity onPress={() => {this.queryVerifyCode()}}
        style={btnStyle}
        disabled={!this.state.canSendCode}>
        <Text style={{color:'white'}}>{this.state.timerTitle}</Text>
      </TouchableOpacity>
    )
  }


  _renderEditPwdBtn(){
    if(this.state.editPwdFormReady){
      var btnStyle = styles.loginBtn;
      var btnDisabled = false;
    }else{
      var btnStyle = [styles.loginBtn, styles.disabledBtn];
      var btnDisabled = true;
    }
    return(
      <View style={styles.loginBtnLine}>
        <TouchableOpacity onPress={() => {this.editPwdAction()}} 
          style={btnStyle}
          disabled={btnDisabled}>
          <Text style={styles.primaryBtnText}>下一步</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderUpdatePwdBtn(){
    if(this.state.updatePwdFormReady){
      var btnStyle = styles.loginBtn;
      var btnDisabled = false;
    }else{
      var btnStyle = [styles.loginBtn, styles.disabledBtn];
      var btnDisabled = true;
    }
    return(
      <View style={styles.loginBtnLine}>
        <TouchableOpacity onPress={() => {this.updatePwdAction()}} 
          style={btnStyle}
          disabled={btnDisabled}>
          <Text style={styles.primaryBtnText}>重置</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const {phone} = this.props;
    if(this.state.gotoLogin){
      return(
        <Redirect to={'/'}/>
      )
    }
    if(!this.state.editPwdResult){
      return (
        <View style={styles.loginPage}>
          {ViewUtils.getResetPwdNavBar(()=> this.setState({gotoLogin: true}), '忘记密码')}
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
                keyboardType='numeric'
                ref={'username'}
                multiline={false}
                autoFocus={true}
                defaultValue={phone.phoneNum}
                onChangeText={(text) => {
                  username = text;
                  if(username != "" && verifyCode != ""){
                    this.setState({ editPwdFormReady: true })
                  }else{
                    this.setState({ editPwdFormReady: false })
                  }
                  if(username != ""){
                    this.setState({ 
                      isPhoneExsit: true,
                    })
                  }else{
                    this.setState({ 
                      isPhoneExsit: false
                    })
                  }
                }}
              />
            </View>
            <View style={[styles.authFormGroup, styles.bottomLine]}>
              <Image source={require('../../res/images/icon/code.png')} 
                     style={styles.authTextIcon}/>
              <TextInput 
                style={styles.authTextField}
                placeholder="请输入验证码"
                placeholderTextColor="#C0C0C0"
                underlineColorAndroid="transparent"
                numberOfLines={1}
                ref={'verifyCode'}
                multiline={false}
                keyboardType='numeric'
                onChangeText={(text) => {
                  verifyCode = text;
                  if(verifyCode != "" && username != ""){
                    this.setState({ editPwdFormReady: true })
                  }else{
                    this.setState({ editPwdFormReady: false })
                  }
                }}/>
              {this.renderCodeBtn()}
              <Loading ref={'loading'} text={'注册中...'} />
            </View>
          </View>
          {this._renderEditPwdBtn()}
          <Loading visible={this.state.updateLoading} />
          <Loading visible={this.state.codeLoading} />
        </View>
      );
    }else{
      return (
        <View style={styles.loginPage}>
          <View style={styles.topTab}>
            <Text style={styles.topTabText}>忘记密码</Text>
          </View>
          <View style={styles.authForm} >
            <View style={[styles.authFormGroup, styles.bottomLine]}>
              <Image source={require('../../res/images/icon/pwd.png')} 
                     style={styles.authTextIcon}/>
              <TextInput 
                style={styles.authTextField}
                placeholder="请输入新密码"
                placeholderTextColor="#C0C0C0"
                underlineColorAndroid="transparent"
                numberOfLines={1}
                ref={'password'}
                defaultValue=""
                multiline={false}
                secureTextEntry={true}
                onChangeText={(text) => {
                  password = text;
                  if(password != "" && username != "" && password_confirmation != ""){
                    this.setState({ updatePwdFormReady: true })
                  }else{
                    this.setState({ updatePwdFormReady: false })
                  }
                }}/>
            </View>
            <View style={styles.authFormGroup}>
              <Image source={require('../../res/images/icon/pwd.png')} 
                     style={styles.authTextIcon}/>
              <TextInput 
                style={styles.authTextField}
                placeholder="请再次输入新密码"
                placeholderTextColor="#C0C0C0"
                underlineColorAndroid="transparent"
                numberOfLines={1}
                ref={'password_confirmation'}
                defaultValue=""
                multiline={false}
                secureTextEntry={true}
                onChangeText={(text) => {
                  password_confirmation = text;
                  if(password != "" && username != "" && password_confirmation != ""){
                    this.setState({ updatePwdFormReady: true })
                  }else{
                    this.setState({ updatePwdFormReady: false })
                  }
                }}/>
            </View>
          </View>
          {this._renderUpdatePwdBtn()}
          {ViewUtils.getXButton(()=> this.setState({gotoLogin: true}))}
          <Loading visible={this.state.updateLoading} />
          <Loading visible={this.state.codeLoading} />
        </View>
      );
    }
 
  }
}
const styles=StyleSheet.create({
  loginPage:{
    marginTop:20,
    backgroundColor:'#f5f5f5',
    flex:1
  },
  fixHeader:{
    position: 'absolute',
    left: 10,
    top: 7,
  },
  topTab:{
    backgroundColor: 'white',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabText:{
    fontSize: 18,
    color: '#606060',
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
    marginTop:65,
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
  const { phone } = state;
  return {
    phone
  }
}

export default connect(mapStateToProps)(ResetPwd);