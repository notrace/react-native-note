//根据页面
'use strict';

import React from 'react';
import {
  StyleSheet,
  Navigator,
  StatusBar,
  BackAndroid,
  View,
  Text,
  Platform
} from 'react-native';

import AuthPage from './pages/AuthPage';
import ResetPwd from './pages/ResetPwd';
import UserAuth from './pages/UserAuth';
import UserAuthResult from './pages/UserAuthResult';


import HomeRoot from './pages/HomeRoot';
import { connect } from 'react-redux';

import { NativeRouter, Route, Redirect } from 'react-router-native'

export const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : 25)
export const ABOVE_LOLIPOP = Platform.Version && Platform.Version > 19
var _navigator;


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  configureScene(route, routeStack) {
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    const {login} = this.props;
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        login.authData === '' ? 
          (<Redirect to={{ pathname: '/login', state: { from: props.location }}}/>) : 
          (login.userData.data.status === '未认证' ? 
            (<Redirect to={{ pathname: '/UserAuth', state: { from: props.location }}}/>):
            (login.userData.data.status === '审核成功' && (!login.userData.data.first_login || login.hasSeeResultOk) ? 
              <Component {...props}/>:
              (<Redirect to={{ pathname: '/UserAuthResult', state: { from: props.location }}}/>)))
      )}/>
    )

    return (
      <NativeRouter>
        <View style={styles.view}>
          <Route path="/UserAuth" component={UserAuth}/>
          <PrivateRoute exact path="/" component={HomeRoot} />
          <Route path="/login" component={AuthPage}/>
          <Route path="/ResetPwd" component={ResetPwd}/>
          <Route path="/UserAuthResult" component={UserAuthResult}/>
        </View>
      </NativeRouter>
    );
  } 
}
let styles = StyleSheet.create({
  view: {
    flex: 1
  }
});

function mapStateToProps(state) {
console.log(">>>>>>>>>> state <<<<<<<<<<")
console.log(state)
  const { login } = state;
  return {
    login
  }
}
export default connect(mapStateToProps)(App);
