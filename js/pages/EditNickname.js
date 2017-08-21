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
} from 'react-native';

import { Redirect } from 'react-router-native'

import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import { toastShort } from '../util/ToastUtil';

var UPLOAD_AVATAR_URL = ApiUtils.getUrl() + '/people/3';
var nickname = '';
class EditNickname extends Component {
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

  updateUser(person){
    const {login, dispatch} = this.props;
    fetch(UPLOAD_AVATAR_URL,{
      method: 'PUT',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify(person)
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log(json);
      console.log(response);
      if(response.ok){
        dispatch(performGetAction(json));
        toastShort('更新成功');
        this.onBack();
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  renderEditCardBtn(){
    return(
      <TouchableOpacity onPress={() => this._gotoUserAuth()} style={styles.editBtn}>
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

  render() {
    const {user} = this.props;
    var person = user.userData.data.person ;

    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getNavBar(()=>this.onBack(), '昵称', (userData)=>this.updateUser(
            {nickname: nickname}
          ))}
        <View style={[GlobalStyles.settingGroupContain, styles.settingGroup]}>
          <TextInput 
            style={styles.textField}
            placeholderTextColor="#C0C0C0"
            underlineColorAndroid="transparent"
            numberOfLines={1}
            multiline={false}
            autoFocus={true}
            textAlign='left'
            clearButtonMode='while-editing'
            defaultValue={user.userData.data.person.nickname}
            onChangeText={(text) => {
              nickname = text;
              if(nickname != ""){
                this.setState({ formReady: true })
              }else{
                this.setState({ formReady: false })
              }
            }}/>
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
  textField:{
    height:45,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    textAlign: 'left',
    textAlignVertical:'center',
    color:"#606060",
  },
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(EditNickname);