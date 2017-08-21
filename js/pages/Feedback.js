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

var SUBMIT_FEEDBACK_URL = ApiUtils.getUrl() + '/feedbacks';
var MaxLength = 250;
var note = '';
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formReady: false,
      contentMargin : 250,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  submitNote(feedback){
    const {login, dispatch} = this.props;
    fetch(SUBMIT_FEEDBACK_URL,{
      method: 'POST',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify(feedback)
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      if(response.ok){
        toastShort('提交成功');
        this.onBack();
      }else{
        toastShort(json.errors.join(","));
      }
    })
  }

  render() {
    const {user} = this.props;
    var person = user.userData.data.person ;

    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getFeedbackBar(()=>this.onBack(), '意见反馈', (userData)=>this.submitNote(
            {note: note}
          ))}
        <View style={[GlobalStyles.settingGroupContain, styles.settingGroup]}>
          <TextInput 
            style={styles.textField}
            placeholderTextColor="#C0C0C0"
            placeholder="请输入宝贵意见，我们将为您持续改进"
            underlineColorAndroid="transparent"
            numberOfLines = {9}
            multiline = {true}
            autoFocus = {true}
            maxLength = {MaxLength}
            textAlign='left'
            clearButtonMode='while-editing'
            onChangeText={(text) => {
              note = text;
              if(note != ""){
                this.setState({ 
                  formReady: true,
                  contentMargin: (MaxLength - note.length)
                })
              }else{
                this.setState({ 
                  formReady: false,
                  contentMargin: (MaxLength - note.length)
                })
              }
            }}/>
          <Text style={styles.contentMargin}>{this.state.contentMargin}</Text>      
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
    marginTop: 0,
  },
  textField:{
    height:220,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    textAlign: 'left',
    textAlignVertical:'center',
    color:"#606060",
  },
  contentMargin:{
    fontSize: 14,
    color: 'red',
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
});
function mapStateToProps(state) {
  const { login,user } = state;
  return {
    login,
    user,
  }
}
export default connect(mapStateToProps)(Feedback);