/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Login from './Login';
import Register from './Register';

export default class AuthPageHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topSelectTab: 'login',
    };
  }

  render(){
    return (
      <TabNavigator tabBarStyle={styles.topTabBar} sceneStyle={ {paddingBottom: 0} }>
        <TabNavigator.Item 
          selected={this.state.topSelectTab === "login"}
          onPress={() => this.setState({ topSelectTab: "login" })}
          renderIcon={() => <Image style={styles.tabIcon} source={require("../../res/images/icon/unlogin.png")} />}
          renderSelectedIcon={() => <Image style={styles.tabIcon} source={require("../../res/images/icon/login.png")} />}
          tabStyle={[styles.tabStyle, styles.topTabLeft]}
          >
          <Login {...this.props} /> 
        </TabNavigator.Item>
        <TabNavigator.Item 
          selected={this.state.topSelectTab === "register"}
          onPress={() => this.setState({ topSelectTab: "register" })}
          renderIcon={() => <Image style={styles.tabIcon} source={require("../../res/images/icon/unregister.png")} />}
          renderSelectedIcon={() => <Image style={styles.tabIcon} source={require("../../res/images/icon/register.png")} />}
          tabStyle={[styles.tabStyle, styles.topTabRight]}
          >
          <Register {...this.props} /> 
        </TabNavigator.Item>
      </TabNavigator>
    )
  }
}
var styles = StyleSheet.create({
  topTabBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop:40,
    height: 68,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 0.5,
  },
  tabIcon: {
    width: 90,
    height: 30,
  },
  tabStyle: {
    flex:0,
    height: 30,
    width: 90,
    alignItems: 'center',
  },
  topTabLeft: {

  },
  topTabRight: {

  },
});