/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import Setting from './Setting';
import AboutMe from './AboutMe';
import TalkCompany from './TalkCompany';
import CollectCompany from './CollectCompany';

import { toastShort } from '../util/ToastUtil';

import { performUpdatePhone } from '../actions/PhoneAction'

var REQUEST_URL = ApiUtils.getUrl() + '/users/1';
class Me extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  componentDidMount() {
    this.fetchUserData();  
  }

  fetchUserData(){
    const {dispatch, login} = this.props;
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData),
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        dispatch(performGetAction(json));
        dispatch(performUpdatePhone(json.phone))
        console.log(">>>>>>>>>><<<<<<<")
        console.log(json.phone)
      }else{
        toastShort(json.errors.join(","));
      }
    });
  }

  onClick(tag){
    switch(tag){
      case 'setting' : 
        TargetComponent = Setting;
        break;
      case 'aboutMe' : 
        TargetComponent = AboutMe;
        break;
      case 'talkCompany' : 
        TargetComponent = TalkCompany;
        break;
      case 'collectCompany' : 
        TargetComponent = CollectCompany;
        break;
    }
    if (TargetComponent) {
      this.props.navigator.push({
        component: TargetComponent,
      });
    }
  }

  render() {
    const {user} = this.props;
    console.log(">>>>>>>>>Me page render<<<<<<<<<")
    console.log(user)
    if(user.userData == ''){
      return (
        <ParallaxScrollView
          backgroundColor="#24AE95"
          contentBackgroundColor="#F8F8F8"
          parallaxHeaderHeight={300}
          renderForeground={() => (
          <View key="parallax-header" style={ styles.parallaxHeader }>
            <Text style={ styles.sectionSpeakerText }></Text>
            <Text style={ styles.sectionTitleText }></Text>
          </View>
          )}>
          <View style={{ height: 100 }}></View>
        </ParallaxScrollView>
      )
    }else{
      var person = user.userData.data.person ;
      var borderSettingItemStyle = { borderBottomWidth: 0.5, borderColor: '#E0E0E0'};
      return (
        <View style={styles.container}>
          <View key="parallax-header" style={ styles.parallaxHeader }>
            <View style={ styles.avatarBox }>
              <Image style={ styles.avatar } source={{
                uri: person.avatar,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE
              }}/>
            </View>
            <Text style={ styles.sectionSpeakerText }>
            {person.nickname}
            </Text>
            <Text style={ styles.sectionTitleText }>
              {person.company_name}
            </Text>
            <Text style={ styles.sectionTitleText }>
              {person.name}   {person.position}
            </Text>
          </View>
          <View style={styles.settingGroupContain}>
            {ViewUtils.getSettingItem(()=>this.onClick('aboutMe'), '我的名片',require('../../res/images/icon/about_me.png'), borderSettingItemStyle)}
            {ViewUtils.getSettingItem(()=>this.onClick('talkCompany'), '我约谈的项目',require('../../res/images/icon/talk_company.png'), borderSettingItemStyle)}
            {ViewUtils.getSettingItem(()=>this.onClick('collectCompany'), '我收藏的项目',require('../../res/images/icon/collect_company.png'))}
          </View>
          <View style={styles.settingGroupContain}>
            {ViewUtils.getSettingItem(()=>this.onClick('setting'), '设置',require('../../res/images/icon/setting_icon.png'))}
          </View>
        </View>
      )
    }
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 90;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 230;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  parallaxHeader: {
    height: PARALLAX_HEADER_HEIGHT,
    backgroundColor: '#24AE95',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 40
  },
  avatarBox:{
    width: AVATAR_SIZE + 15,
    height: AVATAR_SIZE + 15,
    borderRadius: (AVATAR_SIZE + 15) / 2,
    borderColor: "white",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 3
  },
  settingGroupContain: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
    marginTop: 15,
    backgroundColor: 'white',
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  rowText: {
    fontSize: 20
  }
});
function mapStateToProps(state) {
  const { user, login, phone } = state;
  return {
    login,
    user,
    phone,
  }
}
export default connect(mapStateToProps)(Me);