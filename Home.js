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
  Text,
  ListView,
  View
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import SecondPageHome from './SecondPageHome';
import Discover from './Discover';
import Me from './js/pages/me';
import ContactsScreen from './js/easemob/Containers/ContactsScreen';

export default class Home extends Component {
   constructor(props) {
    super(props);
    this.state = {
      bottomSelectTab: 'project',
    };
  }

  _renderBottomTab(Component, bottomSelectTab, title){
    switch(bottomSelectTab){
      case 'project' :
        var renderIcon = require('./res/images/icon/unproject.png');
        var renderSelectIcon = require('./res/images/icon/project.png');
        break;
      case 'discover' :
        var renderIcon = require('./res/images/icon/undiscover.png');
        var renderSelectIcon = require('./res/images/icon/discover.png');
        break;
      case 'message' :
        var renderIcon = require('./res/images/icon/unmessage.png');
        var renderSelectIcon = require('./res/images/icon/message.png');
        break;
      case 'me' :
        var renderIcon = require('./res/images/icon/unme.png');
        var renderSelectIcon = require('./res/images/icon/me.png');
        break;
    }
    return (
      <TabNavigator.Item
        selected={this.state.bottomSelectTab === bottomSelectTab}
        onPress={() => this.setState({ bottomSelectTab: bottomSelectTab })}
        renderIcon={() => <Image style={styles.bottomTabSelectedIcon} source={renderIcon} />}
        renderSelectedIcon={() => <Image style={styles.bottomTabSelectedIcon} source={renderSelectIcon} />}
        tabStyle={styles.bottomTabStyle}
        selectedTitleStyle={styles.bottomTabSelectTitle}
        title={title} 
        titleStyle={styles.bottomTabText}>
        <Component {...this.props} />
      </TabNavigator.Item>
    )
  }

  render() {
    return (
      <TabNavigator tabBarStyle={styles.bottomTabBar} >
        {this._renderBottomTab(SecondPageHome, 'project', '项目')}
        {this._renderBottomTab(Discover, 'discover', '发现')}
        {this._renderBottomTab(ContactsScreen, 'message', '消息')}
        {this._renderBottomTab(Me, 'me', '我的')}
      </TabNavigator>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bottomTabBar: {
    alignItems: 'center',
  },
  bottomTabStyle: {
    height: 51,
    justifyContent: 'center',
    // marginBottom: 4,
  },
  bottomTabText: {
    fontSize: 12,
  },
  bottomTabSelectedIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottomTabSelectTitle: {
    color: '#24AE95',
  },
});
