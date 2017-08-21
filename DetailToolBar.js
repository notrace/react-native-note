/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Platform,
  View
} from 'react-native';

import { connect } from 'react-redux';
import { performGetAction } from './js/actions/UserAction'
import MessageActions from './js/easemob/Redux/MessageRedux'

import ApiUtils from './js/util/ApiUtils'
import ViewUtils from './js/util/ViewUtils';
import { toastShort } from './js/util/ToastUtil';

import Bp from './js/pages/Bp';
import Modal from 'react-native-root-modal';

var MaxLength = 100;
var note = '';

class DetailToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollect: false,
      isTalk: false,
      collectId: null,
      talkId: null,
      hasBp: false,
      showTalk: false,
      contentMargin : 'xxx',
    };
    const {user} = this.props;
    var company = this.props.company;
    console.log(">>>>>>>>>>debug<<<<<<<<<")
    console.log(user)
    console.log(user.userData)
    console.log(user.userData.data)
    userdata = user.userData.data.person;
    console.log(">>>>>>>>><<<<<<<<<")
    console.log(user)
    note = "我是" + userdata.company_name + '的' + userdata.position + userdata.name + "。看到" + company.name + "这个项目正在VC MIX上融资，我对此很感兴趣，希望能进行约谈" ;
  }

  componentDidMount() {
    this.fetchData(this.props.id);  
  }

  fetchData(id) {
    var REQUEST_URL = ApiUtils.getUrl() + '/companies/' + id + '.json';
    const {login} = this.props;
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData)
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.errors){
          toastShort(responseData.errors.join(","));
        }else{
          var hasBp = (responseData.bp != null)   
          this.setState({
            isCollect: responseData.is_collect,
            collectId: responseData.collect_id,
            isTalk: responseData.is_talk,
            talkId: responseData.talk_id,
            hasBp: hasBp,
          });
        }
      }).catch((error)=> {
        toastShort('服务器出错啦');
      });
  }

  getCollectButton() {
    if(this.state.isCollect){
      return(
        <TouchableHighlight style={styles.actionItemBox} onPress = {()=>this.updateUserCompanyCollect({company_id: this.props.id})}>
            <View 
              style={[styles.actionItem, styles.actionCollect]}>
                <Image style={[styles.bottomIcon, styles.actionCollectIcon]} source={require('./res/images/icon/collect_company.png')}/>
                <Text style={styles.actionCollectText}>已收藏 </Text>
            </View>
        </TouchableHighlight>
      )   
    }else{
      return(
        <TouchableHighlight style={styles.actionItemBox} onPress = {()=>this.updateUserCompanyCollect({company_id: this.props.id})}>
            <View 
              style={[styles.actionItem, styles.actionCollect]}>
                <Image style={[styles.bottomIcon, styles.actionCollectIcon]} source={require('./res/images/icon/collect.png')}/>
                <Text style={styles.actionCollectText}> 收藏 </Text>
            </View>
        </TouchableHighlight>
      )    
    }
  }

  getCallButton() {
    if(this.state.isTalk){
      return (
        <TouchableHighlight style={styles.actionItemBox} 
          onPress = {()=>this._onPressAction()}>
            <View style={[styles.actionItem, styles.actionCall]}>
                <Image 
                  style={[styles.bottomIcon, styles.actionCallIcon ]}
                  source={require('./res/images/icon/talk_company.png')}/>
                <Text style={styles.actionCallText}> 已约谈</Text>
            </View>
        </TouchableHighlight>
      )
    }else{
      return (
        <TouchableHighlight style={styles.actionItemBox} 
          onPress = {()=>this._onPressAction()}>
            <View style={[styles.actionItem, styles.actionCall]}>
                <Image 
                  style={[styles.bottomIcon, styles.actionCallIcon ]}
                  source={require('./res/images/icon/call.png')}/>
                <Text style={styles.actionCallText}> 约谈</Text>
            </View>
        </TouchableHighlight>
      )
    }
  }

  getShowBpButton() {
    if(this.state.hasBp){
      return (
        <TouchableHighlight 
          style={[styles.actionItemBox, {flex:1}]} 
          onPress = {()=>this.showBp()}>
            <View style={[styles.actionItem, styles.actionShowBP]}>
              <Text style={styles.actionShowBPText}>查看BP</Text>
            </View>
        </TouchableHighlight>
      )
    }else{
      return (
        <TouchableHighlight 
          style={[styles.actionItemBox, {flex:1}]}>
            <View style={[styles.actionItem, styles.actionShowBP]}>
              <Text style={styles.actionShowBPText}>没有BP</Text>
            </View>
        </TouchableHighlight>
      )      
    }

  }

  _onPressAction(){
    this.setState({
      showTalk: true
    })
  }

  _closeTalkModal(){
    this.setState({
      showTalk: false
    })
  }

  _renderCompanyLogoBox(){
    var company = this.props.company;
    return(
      <View style={ styles.CompanyLogoContainer }>
        <View style={ styles.logoBox }>
          <Image style={ styles.logo } source={{
            uri: company.logo,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE
          }}/>
        </View>
        <Text style={ styles.companyName }>{company.name}</Text>
      </View>
    )
  }

//我是XXXX投资公司投资总监林方。看到阿里巴巴这个项目正在VC MIX上融资，我对此很感兴趣，希望能进行约谈
  _renderTalkInputContainer(){
    return(
      <View style={styles.textFieldContainer}>
        <TextInput 
          style={styles.textField}
          placeholderTextColor="#C0C0C0"
          placeholder="请输入宝贵意见，我们将为您持续改进"
          underlineColorAndroid="transparent"
          numberOfLines = {9}
          multiline = {true}
          autoFocus = {true}
          maxLength = {MaxLength}
          defaultValue = {note}
          textAlign='left'
          clearButtonMode='while-editing'
          onChangeText={(text) => {
            note = text;
            this.setState({ 
              contentMargin: (MaxLength - note.length)
            })
          }}/>
        <Text style={styles.contentMargin}>
        { this.state.contentMargin === 'xxx' ? (MaxLength - note.length) : this.state.contentMargin
        }</Text>      
      </View>
    )
  }

  _renderTalk(){
    return(
      <Modal
          style={styles.modal}
          visible={this.state.showTalk}
      >
        <View style={styles.talkContainer}>
          <View style={styles.XButtonContainer}>
            {ViewUtils.getXButton(() => this._closeTalkModal())}
          </View>
          {this._renderCompanyLogoBox()}
          {this._renderTalkInputContainer()}
          {this._renderSendTalkBtn()}
        </View>
      </Modal>
    )
  }

  _renderSendTalkBtn(){
    return(
      <TouchableOpacity onPress={() => {this.submitTalk()}} 
        style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>发送</Text>
      </TouchableOpacity>
    )
  }

  render() {
    var collectButton = this.getCollectButton();
    var callButton = this.getCallButton();
    var showBpButton = this.getShowBpButton();

    return (
      <View key="fixed-footer" style={styles.fixedFooter}>
          <View style={styles.actionsContainer}>
              {collectButton}
              {callButton}
              {showBpButton}
          </View>
          {this._renderTalk()}
      </View>
    );
  }

  updateUserCompanyCollect(user_company_collect){
    const {login, dispatch} = this.props;

    if(this.state.isCollect){
      var EDIT_USER_COMPANY_COLLECT_URL = ApiUtils.getUrl() + '/user_company_collects/' + this.state.collectId + '.json';
      var method = 'DELETE';
      var message = '取消成功';
    }else{
      var EDIT_USER_COMPANY_COLLECT_URL = ApiUtils.getUrl() + '/user_company_collects.json';
      var method = 'POST';
      var message = '收藏成功';
    }
    fetch(EDIT_USER_COMPANY_COLLECT_URL,{
      method: method,
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify(user_company_collect)
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      this.setState({
        isCollect: !this.state.isCollect,
      });
      if(response.ok){
        toastShort(message);
      }else{
        toastShort(json.errors.join(","));
      }
    })    
  }

  submitTalk(){
    var company = this.props.company;
    var user_company_talk = {
      company_id: this.props.id,
      note: note
    }

    const {login, dispatch} = this.props;
    // this.props.sendTxtMessage('chat', company.im_user_id, {
    //   msg: note.trim()
    // })
    var SUBMIT_URL = ApiUtils.getUrl() + '/user_company_talks';
    fetch(SUBMIT_URL,{
      method: 'POST',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify(user_company_talk)
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        toastShort('约谈成功');
        this._closeTalkModal();
        this.setState({
          isTalk: true,
        })
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  showBp(){
    this.props.showBp(this.props.id)
    // var SHOW_BP_URL = ApiUtils.webUrl() + '/companies/' + this.props.id + '/show_bp';
    // this.props.navigator.push({
    //   component: Bp,
    //     params: {
    //       url: SHOW_BP_URL,
    //       company_id: this.props.id
    //     }
    // });
  }
}

const AVATAR_SIZE = 90;
const ROW_HEIGHT = 60;

var styles = StyleSheet.create({
  submitBtn: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(36,174,149,1)',
    borderRadius: 2,
    marginTop:10,
    height: 40,
    width: 200,
  },
  submitBtnText:{
    color: 'white',
    fontSize: 18,
  },
  modal:{
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    // transform: [{scale: this.state.scaleAnimation}]
  },
  talkContainer:{
    marginTop: -200,
    height: 300,
    width: 300,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingTop: 15,
  },
  XButtonContainer:{
    position: 'absolute',
    left: 0,
    top:10,
  },
  CompanyLogoContainer:{
    marginTop: -45,
    alignItems: 'center',
  },
  logoBox:{
    width: AVATAR_SIZE + 15,
    height: AVATAR_SIZE + 15,
    borderRadius: (AVATAR_SIZE + 15) / 2,
    borderColor: "white",
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: AVATAR_SIZE / 2
  },
  companyName:{
    fontSize: 17,
    color: '#404040',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
  actionsContainer: {
    height: 64,
    paddingTop: (Platform.OS === 'ios') ? 20:0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItemBox: {
  },
  actionItem: {
    flex:1,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  bottomIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  actionCollect: {
    paddingLeft:20,
    paddingRight:20,
    backgroundColor: 'white',
  },

  actionCollectText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#F6A623',
  },
  actionCall: {
    paddingLeft:20,
    paddingRight:20,
    backgroundColor: 'white',
  },
  actionCallIcon: {

  },
  actionCallText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#5EA4F7',
  },
  actionShowBP: {
    backgroundColor: '#24AE95',
  },
  actionShowBPText: {
    fontSize: 16,
    color:'white'
  },
  contentMargin:{
    fontSize: 14,
    color: 'red',
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  textFieldContainer:{
    height:150,
    width: 280,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  textField:{
    height:140,
    width: 260,
    marginLeft: 15,
    fontSize: 15,
    textAlign: 'left',
    textAlignVertical:'center',
    color:"#606060",

  },
});
const mapDispatchToProps = (dispatch) => {
  return {
    sendTxtMessage: (chatType, id, message, username) => dispatch(MessageActions.sendTxtMessage(chatType, id, message, username)),
  }
}
function mapStateToProps(state) {
  const { user, login } = state;
  return {
    login,
    user
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(DetailToolBar);