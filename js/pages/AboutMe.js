/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import { Redirect } from 'react-router-native'

import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';
import { toastShort } from '../util/ToastUtil';

import ImagePicker from 'react-native-image-picker';

import EditNickname from './EditNickname';

import UserAuth from './UserAuth';
var options = {
  title: '', // 选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 100, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
  maxHeight: 100, // photos only
  allowsEditing: false, // 当用户选择过照片之后是否允许再次编辑图片
};

// var REQUEST_URL = ApiUtils.getUrl() + '/auth/sign_out';
var UPLOAD_AVATAR_URL = ApiUtils.getUrl() + '/people/3';
class AboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotoUserAuth: false,
      avatarSource: null,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  _gotoUserAuthConfirm(){
    Alert.alert(
      '',
      '修改名片需要重新上传身份证与名片信息',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '重新上传', onPress: () => this._gotoUserAuth()},
      ],
      { cancelable: false }
    )
  }

  _gotoUserAuth() {
    this.props.navigator.push({
      component: UserAuth,
    });
  }



  avatarImage(avatar){
    var borderSettingItemStyle = { borderBottomWidth: 0.5, borderColor: '#E0E0E0'};
    if(this.state.avatarSource != null){
      return(
        ViewUtils.getAvatarSettingItem(()=>this.editAvatar(), '编辑头像',this.state.avatarSource, borderSettingItemStyle)
      )
    }else{
      return(
        ViewUtils.getAvatarSettingItem(()=>this.editAvatar(), '编辑头像',avatar, borderSettingItemStyle)
      )
    }
  }

  editAvatar(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        // 这是当用户选择customButtons自定义的按钮时，才执行
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        console.log("-------------file path is:");
        console.log(response);
        if (Platform.OS === 'android') {
          var source = {uri: response.uri, isStatic: true};
        } else {
          if (response.uri.includes(".gif")) {
            var source = {uri: 'data:image/' + 'gif' + ';base64,' + response.data, isStatic: true};
          } else if (response.uri.includes(".png")) {
            var source = {uri: 'data:image/' + 'png' + ';base64,' + response.data, isStatic: true};
          } else {
            var source = {uri: 'data:image/' + 'jpeg' + ';base64,' + response.data, isStatic: true};
          }
        }
        this.setState({
          avatarSource: source,
        });
        this.updateAvatar(source);
      }
    })
  }

  updateAvatar(source){
    const {login, dispatch} = this.props;
    fetch(UPLOAD_AVATAR_URL,{
      method: 'PUT',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify({
        'person' : {
        'avatar': source ? source.uri : '', 
        }
      })
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log(json);
      console.log(response);
      if(response.ok){
        // dispatch(performRefreshTokenAction(response));
        dispatch(performGetAction(json));
        toastShort('更新成功');
        // this.setState({
        //   updatePwdResult: true,
        //   updatePwdLoading: false,
        //   gotoLogin: true,
        // });
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  editNickname(){
    this.props.navigator.push({
      component: EditNickname,
    });
  }

  renderEditCardBtn(){
    return(
      <TouchableOpacity onPress={() => this._gotoUserAuthConfirm()} style={styles.editBtn}>
        <Text style={styles.editBtnText}>修改</Text>
      </TouchableOpacity>
    )
  }

  renderCardInfoItem(title, content){
    return(
      <View style={styles.infoItem}>
        <Text style={styles.infoContent}>{title}</Text>
        <Text style={styles.infoContent}>{content}</Text>
      </View>
    )
  }

  onClick() {

  }

  render() {
    if(this.state.gotoUserAuth){
      return(
        <Redirect to={'/UserAuth'}/>
      )
    }
    const {user} = this.props;
    var person = user.userData.data.person ;
    var avatar = {uri: person.avatar};

    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getNavBar(()=>this.onBack(), '个人信息')}
        <View style={GlobalStyles.settingGroupContain}>
          {this.avatarImage(avatar)}
          {ViewUtils.getTextSettingItem(()=>this.editNickname(), person.nickname ,'昵称')}
        </View>
        <View style={[GlobalStyles.settingGroupContain, styles.settingGroup]}>
          <View style={styles.cardTitleContainer}>
            <Text style={GlobalStyles.titleStyle}>我的名片</Text>
          </View>
          <View style={styles.cardStyle}>
            {this.renderCardInfoItem('姓名', person.name)}
            {this.renderCardInfoItem('公司', person.company_name)}
            {this.renderCardInfoItem('职位', person.position)}
            {this.renderCardInfoItem('手机号', person.phone_num)}
            {this.renderCardInfoItem('邮箱', person.email)}
            {this.renderCardInfoItem('地区', person.area)}
          </View>
          {this.renderEditCardBtn()}
        </View>
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
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  cardStyle:{
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  infoItem:{
    height: 44,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  infoContent:{
    fontSize: 17,
    color: '#909090',
  },
  editBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editBtnText: {
    color: '#24AE95',
    fontSize: 18,
  }
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(AboutMe);