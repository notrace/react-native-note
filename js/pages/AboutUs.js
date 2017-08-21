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
  WebView,
} from 'react-native';

import { Redirect } from 'react-router-native'

import GlobalStyles from '../util/GlobalStyles.js'
import { connect } from 'react-redux';
import { performGetAction } from '../actions/UserAction'

import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';

import { toastShort } from '../util/ToastUtil';

const WEBVIEW_REF = 'webview';

var ABOUT_ME_URL = ApiUtils.webUrl() + '/about_me';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoBack: false,
    };
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

  render() {
    const {user} = this.props;
    var person = user.userData.data.person ;

    return(
      <View style={styles.settingContainer}>
        {ViewUtils.getNavBar(()=>this.onBack(), '关于我们')}
        <WebView
          ref={WEBVIEW_REF}
          bounces={false}
          scalesPageToFit={true}
          startInLoadingState={true}
          onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
          onMessage={this.handleMessage}
          source={{uri: ABOUT_ME_URL}}/>
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
export default connect(mapStateToProps)(AboutUs);