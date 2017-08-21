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
  Linking,
  WebView,
  TouchableOpacity,
  Text,
  Platform,
  View
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from './js/util/ViewUtils';
import GlobalStyles from './js/util/GlobalStyles'
import DetailToolBar from './DetailToolBar'
import ApiUtils from './js/util/ApiUtils'
import IconUtils from './js/util/IconUtils'
import CompanyWeb from './js/pages/CompanyWeb'
import Share, {ShareSheet, Button} from 'react-native-share';
import * as WechatAPI from 'react-native-wx';
import Bp from './js/pages/Bp';

const WEBVIEW_REF = 'webview';
const NAV_BAR_HEIGHT_IOS = GlobalStyles.nav_bar_height_ios;
const NAV_BAR_HEIGHT_ANDROID = GlobalStyles.nav_bar_height_android;

var shareOptions = {};

export default class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url ? this.props.url : ApiUtils.getUrl() + "companies/1.html",
      canGoBack: false,
      title: this.props.title,
      theme: this.props.theme,
      visible: false,
      isWXAppSupportApi: WechatAPI.isWXAppSupportApi(),
      isWXAppInstalled: WechatAPI.isWXAppInstalled(),
    }
  }

  componentDidMount() {
    shareOptions = {
      type: "news",
      title: this.props.company.name,
      description: this.props.company.share_description,
      webpageUrl: this.state.url,
      imageUrl: this.props.company.share_image_url,
    }; 
  }

  onCancel() {
    console.log("CANCEL")
    this.setState({visible:false});
  }
  onOpen() {
    console.log("OPEN")
    this.setState({visible:true});
  }

  onBackPress(e){
      this.onBack();
      return true;
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      // url: navState.url,
    });
  }

  _pressButton() {
    const { navigator } = this.props;
    if(navigator) {
      //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到了上一个页面:FirstPageComponent了
      navigator.pop();
    }
  }

  getLeftButton(callBack) {
    return(
      <TouchableOpacity style={{padding:8}} onPress={callBack}>
        <Image
            style={{width: 26, height: 26,}}
            source={require('./res/images/icon/ic_code.png')}/>
      </TouchableOpacity>
    )
  }

  collectAction() {
    Alert.alert("努力开发中");
  }

  renderButton(text, icon, callBack) {
    return(
      <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={ callBack }>
          <Image style={styles.icon} source={icon} />
          <Text style={styles.buttonText}>
            {text}
          </Text>
      </TouchableOpacity>
    )
  }

  renderShareSheet(shareOptions){

    return(
      <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
        <View style={styles.shareTextLine}>
          <Text style={styles.shareText}>分享到</Text>
        </View>
        <View style={styles.buttonLine}>
          {this.renderButton('微信好友', require('./res/images/icon/weixin_message.png') , () => {
            this.onCancel();
            setTimeout(() => {
              WechatAPI.shareToSession(shareOptions);
            },300);
            })
          }
          {this.renderButton('朋友圈', require('./res/images/icon/wecat_timeline.png') , () => {
            this.onCancel();
            setTimeout(() => {
              WechatAPI.shareToTimeline(shareOptions);
            },300);
            })
          }
        </View>
      </ShareSheet>
    )
  }

  showBp(id){
    var SHOW_BP_URL = ApiUtils.webUrl() + '/companies/' + id + '/show_bp';
    this.props.navigator.push({
      component: Bp,
        params: {
          url: SHOW_BP_URL,
          company_id: id
        }
    });
  }

  render() {
    return (
      <View style={styles.fixedSection}>
        <CompanyWeb {...this.props}  showBp={(id)=> this.showBp(id)}/>
        {ViewUtils.getWebviewNav(()=>this.onBack(), '', ()=>this.onOpen())}
        <DetailToolBar id={this.props.id}  {...this.props} showBp={(id)=> this.showBp(id)}/>
        {this.renderShareSheet(shareOptions)}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  fixedSection: {
    flex: 1,
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,

  },
  shareTextLine:{
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 20,
  },
  shareText:{
    color: "#909090",
    fontSize: 17,
  },
  buttonLine: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    marginTop: 10,
    color: '#606060',
    textAlign: 'center',
    fontSize: 15,
    textAlignVertical: 'center',
    width: 70,
  },
  button: {
    height: 100,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
  }
});
