'use strict';
import React, {Component,PropTypes} from 'react';
import{ 
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Linking,
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
import { performSaveUserDataAction,performClickGoToHomeAction } from '../actions/LoginAction'
import { performGetAction } from '../actions/UserAction'
import Loading from '../component/Loading_DD';
import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';
import { toastShort } from '../util/ToastUtil';

// var UPDATE_REQUEST_URL = ApiUtils.getUrl() + '/forgot_password';

var EncryptionModule = NativeModules.EncryptionModule;
var REQUEST_URL = ApiUtils.getUrl() + '/users/1';

class UserAuthResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotoHome: false,
      gotoUserAuth: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchUserData();  
  }

  fetchUserData(){
    const {login,dispatch} = this.props;
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData),
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        dispatch(performGetAction(json));  
        dispatch(performSaveUserDataAction(json));
      }else{
        toastShort(json.errors.join(","));
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
    });
  }

  _openPhone(phoneNum){
    Linking.canOpenURL("tel:"+phoneNum);
  }

  _gotoHome(){
    const {login,dispatch} = this.props;
    dispatch(performClickGoToHomeAction());
    this.setState({
      gotoHome: true,
    });
  }

  _gotoUserAuth(){
    this.setState({
      gotoUserAuth: true,
    });    
  }

  _refreshPage(){
    this.setState({
      loading: true
    });
    this.fetchUserData();
    this.setState({
      loading: false
    })
  }

  _renderRefreshBtn(){
    return(
      <TouchableOpacity onPress={() => this._refreshPage()} 
        style={styles.refreshBtn}>
        <Text style={styles.refreshBtnText}>点击刷新状态</Text>
      </TouchableOpacity>
    )
  }

  renderChecking(){
    return(
      <View style={styles.userAuthContain}>
        <View style={styles.userAuthResultLine} >
          <Image source={require('../../res/images/icon/checking.png')} 
                     style={styles.checkingImage}/>
        </View>
        <View style={styles.userAuthResultLine}>
          <Text style={styles.checkingText}>您的申请已提交成功</Text>
        </View>
        <View style={styles.userAuthResultLine}>
          <Text style={styles.checkingText}>审核中，请稍后</Text>
        </View>
        <View style={styles.userAuthResultRefreshLine}>
          {this._renderRefreshBtn()}
        </View>
        <View style={styles.checkingHelpTextLine}>
          <Text style={styles.checkingHelpText}>有问题请拨打客服电话：</Text><TouchableOpacity onPress={() => this._openPhone('400-820-8820')}><Text style={styles.checkingHelpPhoneNum}>400-820-8820</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  renderCheckOk(){
    return(
      <View style={styles.userAuthContain}>
        <View style={styles.userAuthResultLine} >
          <Image source={require('../../res/images/icon/check_ok.png')} 
                     style={styles.checkingImage}/>
        </View>
        <View style={styles.userAuthResultLine}>
          <Text style={styles.checkingText}>认证成功!</Text>
        </View>
        <View style={styles.checkOkBtnLine}>
          <TouchableOpacity onPress={() => this._gotoHome()} 
            style={styles.checkOkBtn}>
            <Text style={styles.primaryBtnText}>进入首页</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

 renderCheckFailed(){
    const {login} = this.props;
    return(
      <View style={styles.userAuthContain}>
        <View style={styles.userAuthResultLine} >
          <Image source={require('../../res/images/icon/check_failed.png')} 
                     style={styles.checkFailedImage}/>
        </View>
        <View style={styles.userAuthResultLine}>
          <Text style={styles.checkingText}>审核失败!</Text>
        </View>
        <View style={styles.checkFailedContain}>
          <Text style={styles.checkFailedDesc}>导致审核失败原因可能有：</Text>
          <Text style={styles.checkFailedDesc}>{login.userData.data.refund_note}</Text>
        </View>
        <View style={styles.checkOkBtnLine}>
          <TouchableOpacity onPress={() => this._gotoUserAuth()} 
            style={styles.checkOkBtn}>
            <Text style={styles.primaryBtnText}>重新上传</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderResult(){
    const {login} = this.props;
    console.log("test save user data login is:");
    console.log(login);
    if(login.userData.data.status == "认证中"){
      return(this.renderChecking())
    }
    if(login.userData.data.status == "审核成功"){
      {return(this.renderCheckOk())}
    }
    if(login.userData.data.status == "审核失败"){
      {return(this.renderCheckFailed())}
    }
  }

  render() {
    if(this.state.gotoHome){
      return(
        <Redirect to={'/'}/>
      )
    }
    if(this.state.gotoUserAuth){
      return(
        <Redirect to={'/UserAuth'}/>
      )
    }
    
    return (
      <View style={styles.loginPage}>
        <View style={styles.topTab}>
          <Text style={styles.topTabText}>身份认证</Text>
        </View>
        {this.renderResult()}
         <Loading visible={this.state.loading} />
      </View>
    );
 
  }
}
const styles=StyleSheet.create({
  loginPage:{
    marginTop:20,
    backgroundColor:'white',
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
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 0.5,
  },
  topTabText:{
    fontSize: 18,
    color: '#606060',
  },
  userAuthContain: {
    flex: 1,
  },
  userAuthResultLine:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkingImage:{
    width: 114,
    resizeMode: 'contain',
  },
  checkingText:{
    color: '#404040',
    fontSize: 19,
  },
  checkingHelpTextLine:{
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  checkingHelpText:{
    color: '#404040',
    fontSize: 14,
  },
  checkingHelpPhoneNum:{
    color: '#17A2FD',
    fontSize: 14,    
  },
  checkOkBtnLine:{
    flexDirection:"row",
    justifyContent:'center',
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
  checkOkBtn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(36,174,149,1)',
    borderRadius: 2,
    marginTop:13,
    height: 40,
    width: 200,
  },
  checkFailedImage:{
    marginTop: 40,
    width: 80,
    resizeMode: 'contain',
  },
  checkFailedContain:{
    marginTop: 60,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  checkFailedDesc:{
    marginLeft:40,
    marginRight:40,
    marginBottom:16,
    color: '#404040',
    fontSize: 16,
    textAlign: 'left',
  },
  userAuthResultRefreshLine:{
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  refreshBtn:{
    height: 38,
    borderRadius: 38,
    borderColor: '#17A2FD',
    borderStyle: null,
    borderWidth: 0.5,
    flexDirection:"row",
    justifyContent:'center',
    alignItems:'center',
    width: 160,
  },
  refreshBtnText:{
    fontSize: 16,
    color: '#17A2FD',
  },
  primaryBtnText:{
    color: 'white',
    fontSize: 18,
  }
});
function mapStateToProps(state) {
  const { login } = state;
  return {
    login
  }
}
export default connect(mapStateToProps)(UserAuthResult);