# react-native-note
使用react-native开发app的笔记

## TODO
 - [ ] 语法疑问
 - [x] [Tab](#Tab)
 - [ ] 保存认证数据
 - [ ] 根据认证数据跳转页面
 - [ ] 组织redux
 - [ ] 环信-最近会话列表

## Tab
[2,1,1,1]形式的二级Tab,数字代表页面的状态
### TODO
 - [x] [文件目录](#文件目录)
 - [x] [代码](#代码)
 - [x] [点击tab页面自动刷新](#点击tab页面自动刷新)
 - [x] [点击跳转页面](#点击跳转页面)
 - [x] [`HomeRoot.js`中`Navigator`的作用](#`HomeRoot.js`中`Navigator`的作用)
 - [x] [webview跳转和返回](#webview 跳转和返回)

### 文件目录
```
|--index.ios.js
  |-- js/root
    |-- js/pages/AuthPage
    |-- js/app
      |-- js/pages/HomeRoot
        |-- Home
          |-- SecondPageHome
            |-- FollowListPage
            |-- RecommendListPage
          |-- Discover
          |-- js/pages/me
          |-- js/easemob/Containers/ContactsScreen
```
### 代码
`js/pages/HomeRoot.js`
```
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  View
} from 'react-native';

import Home from '../../Home';

class HomeRoot extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{index: 0, component: Home }}
        renderScene={(route, navigator) => {
          if(route.component) {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
          }
        }}/>
    );
  }
}
```
`Home.js`
```

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

```
至此，一级Tab完成，接下来是在`项目`页中，顶部的两个tab按钮的实现
`SecondPageHome.js`
```
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import FollowListPage from './FollowListPage';
import RecommendListPage from './RecommendListPage';

export default class SecondPageHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topSelectTab: 'follow',
    };
  }

  _renderSecondPageTab(Component, selectedTab, title, customStyle) {
    return (
      <TabNavigator.Item 
        selected={this.state.topSelectTab === selectedTab}
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
        {this._renderSecondPageTab(FollowListPage, 'follow', '关注', styles.topTabLeft)}
        {this._renderSecondPageTab(RecommendListPage, 'hot', '推荐', styles.topTabRight)}
      </TabNavigator>
    )
  }
}

```
### 点击tab页面自动刷新
`FollowListPage.js`和`RecommendListPage.js`中
```
  componentWillReceiveProps(nextProps) {
    this.onRefresh();
  }
```

### 点击跳转页面
如果不在tab页面上，需要传递props
```
<CompanyCell {...this.props} />
```

```
import ProjectItem from './ProjectItem';
```
```
  _clickToPage(id, url) {
    const {navigator} = this.props;
    if(navigator) {
      navigator.push({
        index: 1,
        component: ProjectItem,
        title: 'Home',
        params: {
          id: id,
        }
      })
    }
  }
```
因为跳转页面不在tab中，所以需要添加返回方法
```
 onBack() {
    this.props.navigator.pop();
  }
```
### `HomeRoot.js`中`Navigator`的作用
为了`点击跳转页面`
### WebView跳转和返回
使用WebView的时候需要添加onNavigationStateChange
```
import {
  StyleSheet,
  TouchableOpacity,
  View,
  WebView,
} from 'react-native';
const WEBVIEW_REF = 'webview';
```
```
  <WebView
    ref={WEBVIEW_REF}
    bounces={false}
    scalesPageToFit={true}
    startInLoadingState={true}
    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
    onMessage={this.handleMessage}
    source={{uri: ABOUT_ME_URL}}/>
```
```
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }
```
如果点击跳转的页面是WebView,那么返回方法需要判断两种状态，native页面和web页面
```
  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }
```
## 保存认证数据
## 根据认证数据跳转页面
## 环信
## 组织redux