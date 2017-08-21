/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  ListView,
  Navigator,
  View
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import { connect } from 'react-redux';
import SecondPageHome from '../../SecondPageHome';
import Home from '../../Home';
import Me from './me';

import WebIM from '../easemob/Lib/WebIM'
import WebIMActions from '../easemob/Redux/WebIMRedux'
import LoginActions from '../easemob/Redux/LoginRedux'
import GroupActions from '../easemob/Redux/GroupRedux'
import SubscribeActions from '../easemob/Redux/SubscribeRedux'
import RosterActions from '../easemob/Redux/RosterRedux'
import MessageActions from '../easemob/Redux/MessageRedux'



class HomeRoot extends Component {
   constructor(props) {
    super(props);
    const {dispatch, login} = this.props;
    dispatch(LoginActions.login(login.userData.data.id.toString(), 'xxxxxxxxxxx'));
    WebIM.conn.listen({
      // xmpp连接成功
      onOpened: (msg) => {
        // 出席后才能接受推送消息
        WebIM.conn.setPresence();
        // 获取好友信息
        dispatch(RosterActions.getContacts())
        // 通知登陆成功
        dispatch(LoginActions.loginSuccess(msg))
        // 获取黑名单列表
        // dispatch(BlacklistActions.getBlacklist())
        // 获取群组列表
        dispatch(GroupActions.getGroups())

        // NavigationActions.contacts()
      },
      // 出席消息
      onPresence: (msg) => {
        switch (msg.type) {
          case 'subscribe':


            // 加好友时双向订阅过程，所以当对方同意添加好友的时候
            // 会有一步对方自动订阅本人的操作，这步操作是自动发起
            // 不需要通知提示，所以此处通过state=[resp:true]标示
            if (msg.status === '[resp:true]') {
              return
            }

            dispatch(SubscribeActions.addSubscribe(msg))
            break;
          case 'subscribed':
            dispatch(RosterActions.getContacts())
            dispatch(GroupActions.getGroups())
            // Alert.alert(msg.from + ' ' + 'subscribed')
            break;
          case 'unsubscribe':
            // TODO: 局部刷新
            dispatch(RosterActions.getContacts())
            dispatch(GroupActions.getGroups())
            break;
          case 'unsubscribed':
            // 好友退订消息
            dispatch(RosterActions.getContacts())
            dispatch(GroupActions.getGroups())
            // Alert.alert(msg.from + ' ' + 'unsubscribed')
            break;
        }
      },
      // 各种异常
      onError: (error) => {
        console.log(error)
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          console.log('WEBIM_CONNCTION_DISCONNECTED', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }
          Alert.alert('Error', 'server-side close the websocket connection')
          NavigationActions.login()
          return;
        }
        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          console.log('WEBIM_CONNCTION_SERVER_ERROR');
          Alert.alert('Error', 'offline by multi login')
          NavigationActions.login()
          return;
        }
        if (error.type == 1) {
          let data = error.data ? error.data.data : ''
          data && Alert.alert('Error', data)
          dispatch(LoginActions.loginFailure(error))
        }
      },
      // 连接断开
      onClosed: (msg) => {
        console.log('onClosed')
      },
      // 更新黑名单
      // onBlacklistUpdate: (list) => {
      //   dispatch(BlacklistActions.updateBlacklist(list))
      // },
      // 文本信息
      onTextMessage: (message) => {
        console.log('onTextMessage', message)
        dispatch(MessageActions.addMessage(message, 'txt', login.userData.id))
        dispatch(GroupActions.getGroups())
        dispatch(GroupActions.addCount(message))
      },
      onPictureMessage: (message) => {
        console.log('onPictureMessage', message)
        dispatch(MessageActions.addMessage(message, 'img', login.userData.id))
        dispatch(GroupActions.getGroups())
        dispatch(GroupActions.addCount(message))
      }
    })
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          index: 0, 
          component: Home }}
        renderScene={(route, navigator) => {
          if(route.component) {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
          }
        }}/>
    );
  }
}
function mapStateToProps(state) {
  const { login } = state;
  return {
    login
  }
}

export default connect(mapStateToProps)(HomeRoot);