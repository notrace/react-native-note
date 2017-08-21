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
  TextInput,
  View,
  WebView
} from 'react-native';

import { Redirect } from 'react-router-native'

import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import PDFView from 'react-native-pdf-view';

import { toastShort } from '../util/ToastUtil';
const WEBVIEW_REF = 'webview';
var SEND_BP_URL = ApiUtils.getUrl() + '/user_emails.json';

class Bp extends Component {
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

  showSendBp(){
    const {user} = this.props;
    Alert.alert(
      '',
      '确认将BP发送到' + user.userData.data.person.email + '吗?',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '发送', onPress: () => this.sendBp()},
      ],
      { cancelable: false }
    )
  }

  sendBp() {
    const {user, login} = this.props;
    var user_email = {company_id: this.props.company_id};
    fetch(SEND_BP_URL,{
      method: 'POST',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify(user_email)
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log("=========");
      console.log(this.state.isCollect)
      if(response.ok){
        toastShort("发送成功");
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      // url: navState.url,
    });
  }

  handleMessage = (e) => {
    var [action, content] = e.nativeEvent.data.split("-");
    switch(action){
      case 'copy' :
        this._copyContent(content);
        break;
      case 'openurl' :
        this._openUrl(content);
        break;
      default:
        break;
    }
  }

  render() {
    const {user} = this.props;
    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getBpNavBar(()=>this.onBack(), '查看BP', ()=>this.showSendBp())}
          <WebView
            ref={WEBVIEW_REF}
            bounces={false}
            scalesPageToFit={true}
            startInLoadingState={true}
            onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
            onMessage={this.handleMessage}
            source={{uri: this.props.url}}/>

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
  },
  textField:{
    height:45,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
    textAlign: 'left',
    textAlignVertical:'center',
    color:"#606060",
  },
  pdf:{
    flex: 1,
  },
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(Bp);