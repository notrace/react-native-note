
import React  from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Alert,
  View,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

export default class ViewUtils {
  static pageMsg(content) {
    return (
      <View style={styles.pageMsg}>
        <Text style={styles.pageMsgContent}>{content}</Text>
      </View>
    )
  }

  static getSettingItem(callback, title, icon, optionStyle, optionText, optionTextStyle){
    return (
      <TouchableHighlight onPress={callback}>
        <View style={ [styles.setting_item_container, optionStyle]}>
          <View style={{marginLeft:15, alignItems: 'center', flexDirection: 'row'}}>
            {icon ? 
              <Image source={icon} style={[styles.settingIcon]}/>:<View></View>
            }
            <Text style={styles.settingText}>{title}</Text>
          </View>
          <View style={{alignItems: 'flex-end', flexDirection: 'row', marginLeft: 100,}}>
            <Text style={optionTextStyle}>{optionText}</Text>
          </View>
          <Image source={require('../../res/images/icon/right_arrow.png')} style={styles.settingArrow} />
        </View>
      </TouchableHighlight>
    )
  }

  static getAvatarSettingItem(callback, title, avatar, optionStyle) {
    return(
      <TouchableHighlight onPress={callback}>
        <View style={ [styles.avatarSettingItemContainer, optionStyle]}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            {avatar ? 
              <Image source={avatar} style={[styles.avatarIcon]}     />:<View></View>
            }
            <Text style={styles.powerSettingText}>{title}</Text>
          </View>
          <Image source={require('../../res/images/icon/right_arrow.png')} style={styles.settingArrow} />
        </View>
      </TouchableHighlight>
    )
  }

  static getTextSettingItem(callback, title, text, optionStyle) {
    return(
      <TouchableHighlight onPress={callback}>
        <View style={ [styles.textSettingItemContainer, optionStyle]}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            {text ?
              <View style={styles.textSettingTextContainer}>
                <Text style={styles.textSettingText}>{text}</Text>
              </View>:<View></View>
            }
            <Text style={styles.powerSettingText}>{title}</Text>
          </View>
          <Image source={require('../../res/images/icon/right_arrow.png')} style={styles.settingArrow} />
        </View>
      </TouchableHighlight>
    )
  }

  static getMoreButton(callBack) {
      return <TouchableHighlight
          ref='moreMenuButton'
          underlayColor='transparent'
          style={{padding:5}}
          onPress={callBack}>
          <View style={{paddingRight:8}}>
              <Image
                  style={{width: 24, height: 24, marginLeft: 5}}
                  source={require('../../res/images/icon/ic_code.png')}
              />
          </View>
      </TouchableHighlight>
  }

  static getFeedbackBar(callback, title, rightCallback){
    return(
      <View key="fixed-header" style={styles.fixedHeader}>
        {this.getNavBarTitle(title)}
        {this.getXButton(callback)}
        {this.getRightTextButton('发送',rightCallback)}
      </View>
    )
  }

  static getResetPwdNavBar(callback, title){
    return(
      <View key="fixed-header" style={styles.fixedHeader}>
        {this.getXButton(callback)}
        {this.getNavBarTitle(title)}
      </View>
    )
  }

  static getNavBar(callback, title, rightCallback){
    if(rightCallback){
      return(
        <View key="fixed-header" style={styles.fixedHeader}>
          {this.getNavBarTitle(title)}
          {this.getXButton(callback)}
          {this.getTickButton(rightCallback)}
        </View>
      )
    }else{
      return(
        <View key="fixed-header" style={styles.fixedHeader}>
          {this.getNavBarTitle(title)}
          {this.getLeftButton(callback)}
        </View>
      )
    }
  }

  static getBpNavBar(callback, title, rightCallback){
    if(rightCallback){
      return(
        <View key="fixed-header" style={styles.fixedHeader}>
          {this.getNavBarTitle(title)}
          {this.getXButton(callback)}
          {this.getSentButton(rightCallback)}
        </View>
      )
    }
  }

  static getMessageNavBar(callback, title, rightTitle, rightCallback){
    if(rightCallback){
      return(
        <View key="fixed-header" style={styles.fixedHeader}>
          {this.getNavBarTitle(title)}
          {this.getXButton(callback)}
          {this.getRightTextButton(rightTitle,rightCallback)}
        </View>
      )
    }
  }

  static getWebviewNav(callback, title, rightCallback){
    return(
      <View style={styles.fixedWebHeader}>
        {this.getWebBackButton(callback)}
        {this.getRightButton(rightCallback)}
      </View>
    )
  }

  static getNavBarTitle(title){
    return(
      <View style={styles.navBarTitleContainer}>
        <Text style={styles.navBarTitle}>{title}</Text>
      </View>
    )
  }

  static getXButton(callBack) {
    return(
      <View style={styles.fixHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callBack}>
          <Image
              style={{width: 18, height: 18, marginLeft:4}}
              source={require('../../res/images/icon/backX.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  static getLeftButton(callBack) {
    return(
      <View style={styles.fixHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callBack}>
            <Image
                style={{width: 10, height: 18, marginRight:13, marginLeft:4}}
                source={require('../../res/images/icon/back.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  static getTickButton(callback) {
    return(
      <View style={styles.fixRightHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callback}>
            <Image
                style={{width: 24, height: 18, marginRight:2}}
                source={require('../../res/images/icon/tick.png')}/>
        </TouchableOpacity>
      </View>
    ) 
  }

  static getSendButton(callback) {
    return(
      <View style={styles.fixRightHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callback}>
          <Text  style={styles.navBarRightText}>发送</Text>
        </TouchableOpacity>
      </View>
    ) 
  }

  static getRightTextButton(rightTitle, callback) {
    return(
      <View style={styles.fixRightHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callback}>
          <Text  style={styles.navBarRightText}>{rightTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  static getRightButton(callBack) {
    return(
      <View style={styles.fixRightHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callBack}>
            <Image
                style={{width: 36, height: 36, marginRight: -2}}
                source={require('../../res/images/icon/share.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  static getWebBackButton(callBack) {
    return(
      <View style={styles.fixHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callBack}>
            <Image
                style={{width: 36, height: 36, marginLeft: -2}}
                source={require('../../res/images/icon/web_back.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  static getSentButton(callback){
    return(
      <View style={styles.fixRightHeader}>
        <TouchableOpacity
            style={{margin:2}}
            onPress={callback}>
            <Image
                style={{width: 24, height: 18, marginRight:2}}
                source={require('../../res/images/icon/sent_email.png')}/>
        </TouchableOpacity>
      </View>
    ) 
  }

}
var styles = StyleSheet.create({
  fixedHeader: {
    backgroundColor: 'white',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  fixedWebHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    paddingRight: 8,
    marginTop: (Platform.OS === 'ios') ? 20:0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fixHeader:{
    position: 'absolute',
    left: 10,
  },
  fixRightHeader:{
    position: 'absolute',
    right: 10,
  },
  pageMsg: {
    height: 30,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: "#5EA4F7",
  },
  pageMsgContent: {
    color: "white",
    fontSize: 12,
  },
  setting_item_container: {
    backgroundColor: 'white',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  settingIcon: {
    opacity: 1,
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  settingArrow: {
    marginRight: 10,
    height: 12,
    width: 12,
    alignSelf: 'center',
    opacity: 1,
    resizeMode: 'contain'
  },
  settingText:{
    fontSize: 17,
    color: "#606060",
  },
  avatarSettingItemContainer:{
    backgroundColor: 'white',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 15,
  },
  avatarIcon: {
    borderRadius: 56/2,
    width: 56,
    height: 56,
    resizeMode: 'cover',
  },
  textSettingItemContainer:{
    backgroundColor: 'white',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 15,
  },
  powerSettingText:{
    marginLeft: 15,
    fontSize: 18,
    color: '#909090',
  },
  textSettingTextContainer:{
    width: 56,
    justifyContent:'center',
    flexDirection: 'row',
  },
  textSettingText:{
    fontSize: 18,
    color: '#909090',
  },
  navBarTitleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    top: 0,
    right: 40,
    bottom: 0,
  },
  navBarTitle: {
    fontSize: 18,
    color: '#606060',
  },
  navBarRightText:{
    fontSize: 18,
    color: '#24AE95',    
  }
})
