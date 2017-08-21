/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Dimensions,
  StyleSheet,
  Clipboard,
  Image,
  TouchableOpacity,
  Linking,
  ListView,
  Text,
  Platform,
  View,
  WebView,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../util/GlobalStyles'

const WEBVIEW_REF = 'webview';
const NAV_BAR_HEIGHT_IOS = GlobalStyles.nav_bar_height_ios;
const NAV_BAR_HEIGHT_ANDROID = GlobalStyles.nav_bar_height_android;

var shareOptions = {};
var company = {};
export default class CompanyWeb extends Component {
  constructor(props) {
    super(props);
    company = this.props.company;
  }

  // handleMessage = (e) => {
  _handelClick(action, content){
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
  _copyContent(content)  {
    var BUTTONS = ['拷贝', '取消'];
    var CANCEL_INDEX = 1
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      title: "微信账号:" + content,
    },
    (buttonIndex) => {
      Clipboard.setString(content);
    });
  }

  _openUrl(url) {
    Linking.canOpenURL(url)
    .then((supported)=>{  
      if (!supported){  
        console.log('Can\'t handle url: ' + url);  
        Alert.alert(  
          '提示',   
          'Can\'t handle url: ' + url,  
          [  
            {text: 'OK', onPress:()=>{}}  
          ]  
        );  
      }else{  
        return Linking.openURL(url);  
      }  
    })  
    .catch((err)=>{  
      console.log('An error occurred', err);  
      Alert.alert(  
        '提示',   
        'An error occurred: ' + err,  
        [  
          {text: 'OK', onPress:()=>{}}  
        ]  
      );  
    });
  }

  renderCompanyParam(){
    return(
      <View style={styles.cellContainer}>
        <View style={styles.paramContainer}>
          <Text style={styles.paramsTop}>{this.props.company.investment_name}</Text>
          <Text style={styles.paramsBottom}>融资阶段</Text>
        </View>
        <View style={styles.paramContainer}>
          <Text style={styles.paramsTop}>{this.props.company.investment_money}</Text>
          <Text style={styles.paramsBottom}>融资目标</Text>          
        </View>
        <View style={styles.paramContainer}>
          <Text style={styles.paramsTop}>{this.props.company.shares_value}</Text> 
          <Text style={styles.paramsBottom}>出让股份</Text>
        </View>
      </View>
    )
  }

  renderCompanyDesc(){
    if(company.web_url){
      var siteUrlItem = 
          <View style={styles.descUrlContainer}>
            <TouchableOpacity onPress={()=>this._handelClick('openurl',company.web_url)}>
              <Image style={styles.descUrlLogo} source={require('../../res/images/icon/siteIcon.png')}/>
              <Text style={styles.descUrlText}>官网</Text>
            </TouchableOpacity>
          </View>
    }else{
      var siteUrlItem = 
          <View style={styles.descUrlContainer}>
            <Image style={styles.descUrlLogo} source={require('../../res/images/icon/siteGray.png')}/>
            <Text style={[styles.descUrlText, {color:'#C0C0C0'}]}>官网</Text>
          </View>
    }
    if(company.ios_url){
      var iOSUrlItem = 
          <View style={styles.descUrlContainer}>
            <TouchableOpacity onPress={()=>this._handelClick('openurl',company.ios_url)}>
              <Image style={styles.descUrlLogo} source={require('../../res/images/icon/iOSIcon.png')}/>
              <Text style={styles.descUrlText}>iOS</Text>
            </TouchableOpacity>
          </View>
    }else{
      var iOSUrlItem = 
          <View style={styles.descUrlContainer}>
            <Image style={styles.descUrlLogo} source={require('../../res/images/icon/iOSGray.png')}/>
            <Text style={[styles.descUrlText, {color:'#C0C0C0'}]}>iOS</Text>
          </View>
    }
    if(company.wechat){
      var wechatUrlItem = 
          <View style={styles.descUrlContainer}>
            <TouchableOpacity onPress={()=>this._handelClick('copy',company.wechat)}>
              <Image style={styles.descUrlLogo} source={require('../../res/images/icon/wechatIcon.png')}/>
              <Text style={styles.descUrlText}>iOS</Text>
            </TouchableOpacity>
          </View>
    }else{
      var wechatUrlItem = 
          <View style={styles.descUrlContainer}>
            <Image style={styles.descUrlLogo} source={require('../../res/images/icon/wechatGray.png')}/>
            <Text style={[styles.descUrlText, {color:'#C0C0C0'}]}>iOS</Text>
          </View>
    }
    return(
      <View style={[GlobalStyles.cellContainer, {paddingLeft:15, paddingRight:0}]}>
        <View style={styles.descHead}>
          <Text style={styles.descHeadText}>项目资料</Text>
        </View>
        <View style={{marginRight: 15}}>
          <Text style={styles.descText}>项目地址:{company.location}</Text>
          <Text style={styles.descText}>所属行业:{company.trade_tag}</Text>
          <Text style={styles.descText}>成立时间:{company.born_date}</Text>
          <TouchableOpacity style={{padding:8}} onPress={()=>this.props.showBp(company.id)}>
            <View style={styles.descBpContain} >
              <Image source={{uri: company.bp_logo}} style={styles.descBpLogoBg} />
              
              <View style={{position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: 100}}/> 
              <Image source={{uri: company.bp_logo}} style={styles.descBpLogo} />
            </View>
          </TouchableOpacity>
          <View style={styles.descUrlLineContainer}>
              {siteUrlItem}
              {iOSUrlItem}
              {wechatUrlItem}
          </View>
        </View>
      </View>
    )
  }

  renderCompanyRecommed(){
    return(
      <View style={[GlobalStyles.cellContainer, {paddingLeft:15, paddingRight:0, marginBottom: 10,}]}>
        <View style={styles.descHead}>
          <Text style={styles.descHeadText}>推荐理由</Text>
        </View>
        <Text style={styles.recommendText}>{company.recommend_reason}</Text>
      </View>
    )
  }

  renderPerson(person){
    return(
      <View style={styles.personContainer}>
        <Image source={{uri: person.avatar}} style={styles.personLeft} />
        <View style={styles.personRight}>
          <View style={styles.personRightTop}>
            <Text style={styles.personName}>{person.name}</Text>
            <View style={styles.positionContaner}>
              <Text style={styles.personPosition}>{person.position}</Text>
            </View>
          </View>
          <Text style={styles.personDesc}>{person.desc}</Text>
        </View>
      </View>
    )
  }

  renderCompanyPeople(){
      var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      dataSource=dataSource.cloneWithRows(company.people);
    return(
      <View style={[GlobalStyles.cellContainer, {paddingLeft:15, paddingRight:0}]}>
        <View style={[styles.descHead, styles.scopeHead]}>
          <Text style={styles.descHeadText}>团队成员</Text>
          <Text style={styles.scopeText}>团队规模:{company.team_scope}</Text>
        </View>
        <View style={styles.peopleList}>
          <ListView
            dataSource={dataSource}
            renderRow={(e)=>this.renderPerson(e)}
            style={styles.listView}
            enableEmptySections={true}/>
        </View>
      </View>
    )    
  }

  renderCompanyInvestment(){
    return(
      <View style={[GlobalStyles.cellContainer, {paddingLeft:15, paddingRight:0}]}>
        <View style={styles.descHead}>
          <Text style={styles.descHeadText}>过往融资</Text>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          style={[styles.webview, {width: window.width,height:50 + company.investments.length * 50,}]}
          bounces={false}
          scalesPageToFit={true}
          startInLoadingState={true}
          source={{uri: company.show_sample}}/>        
      </View>    
    ) 
  }

  render() {
    return (
        <ParallaxScrollView
          backgroundColor="#FFFFFF"
          contentBackgroundColor="#F8F8F8"
          stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          renderStickyHeader={() => (
            <View key="sticky-header" style={styles.stickySection}>
              <Text style={styles.stickySectionText}>{this.props.company.name}</Text>
            </View>
            )}

          renderBackground={() => (
            <View key='background'>
              <Image source={{uri: this.props.company.logo, width: window.width, height:PARALLAX_HEADER_HEIGHT}} />
              <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/> 
              </View>
          )}
          renderForeground={() => (
          <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={{
                  uri: this.props.company.logo,
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE
                }}/>
            <Text style={ styles.sectionSpeakerText }>{this.props.company.name}</Text>
            <Text style={ styles.sectionTitleText }>{this.props.company.desc}</Text>
          </View>
          )}>
          {this.renderCompanyParam()}
          {this.renderCompanyDesc()}
          {this.renderCompanyRecommed()}
          {this.renderCompanyPeople()}
          {this.renderCompanyInvestment()}
        </ParallaxScrollView>
    );
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 90;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 230;
const STICKY_HEADER_HEIGHT = 68;

var styles = StyleSheet.create({
  parallaxHeader: {
    height: PARALLAX_HEADER_HEIGHT,
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 40
  },
  paramContainer:{

  },
  paramsTop:{
    textAlign: 'center',
    fontSize: 18,
    color:'#404040',
  },
  paramsBottom:{
    marginTop:10,
    textAlign: 'center',
    fontSize: 16,
    color:'#909090',
  },
  stickySection: {
    paddingTop: 20,
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  stickySectionText: {
    color: '#404040',
    fontSize: 20,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
  cellContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 15,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    flexDirection: 'row', 
    justifyContent:'space-around', 
    marginTop:0
  },
  descHead:{
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  descHeadText:{
    flex: 1,
    color: '#24AE95',
    fontSize: 16,
  },
  scopeHead:{
    flexDirection: 'row',
    borderBottomWidth: 0,
  },
  descText:{
    marginTop: 10,
    color: '#606060',
    fontSize: 16,
  },
  descBpContain:{
    flex: 1,
    height: 100,
  },
  descBpLogo:{
    top: 0,
    flex: 1,
    resizeMode: 'contain',
  },
  descBpLogoBg:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex:1,
    resizeMode: 'stretch',
  },
  descUrlLineContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  descUrlContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  descUrlLogo:{
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  descUrlText:{
    marginTop: 5,
    color: '#606060',
    fontSize: 16,
    textAlign: 'center',
  },
  recommendText:{
    marginTop: 5,
    fontSize: 17,
    color: '#606060',
    lineHeight: 25,
    marginRight: 10,
  },
  scopeText:{
    fontSize: 14,
    color: '#F6A623',
    textAlign: 'right',
    marginRight: 10,
  },
  personContainer:{
    flexDirection: 'row',
    borderTopColor: '#E0E0E0',
    borderTopWidth: 0.5,
    paddingBottom: 10,
    paddingTop: 10,
  },
  personLeft:{
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'contain',
  },
  personRight:{
    flex: 1,
    paddingLeft: 15,
    flexDirection: 'column',
  },
  personRightTop:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName:{
    color:'#404040',
    fontSize: 17,
  },
  positionContaner:{
    marginLeft: 30,
    backgroundColor: '#8FC1CF',
    borderRadius: 4,
    paddingVertical:2,
    paddingLeft: 4,
    paddingRight: 4,
  },
  personPosition:{
    color: 'white',
    fontSize: 15,
    backgroundColor: '#8FC1CF',
    borderRadius: 5,
  },
  personDesc:{
    fontSize: 16,
    color: '#909090',
    lineHeight: 25,
    textAlign: 'left',
    marginRight: 10,    
  },
  webview:{
    marginVertical: 3,
  },
});
