/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import DiscoverContent from './DiscoverContent';

export default class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topSelectTab: 'Discover',
    };

  }

  _renderSecondPageTab(Component, selectedTab, title, customStyle) {
    return (
      <TabNavigator.Item 
        selected={true}
        onPress={() => this.setState({ topSelectTab: selectedTab })}
        titleStyle={[styles.topTabTitle, customStyle]}
        selectedTitleStyle={styles.topTabSelectTitle}
        title={title} >
        <Component {...this.props} /> 
      </TabNavigator.Item>
    )
  }

  render() {
    return (
      <TabNavigator tabBarStyle={styles.topTabBar} sceneStyle={ {paddingBottom: 0} }>
        {this._renderSecondPageTab(DiscoverContent, 'Discover', '发现', styles.topTabLeft)}
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
    paddingTop:20,
    height: 66,
    backgroundColor: '#24AE95',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTabTitle: {
    fontSize: 18,
    color: 'white',
  },
  topTabSelectTitle: {
    color: 'white',
  },
})