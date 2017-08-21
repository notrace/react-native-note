import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  TouchableWithoutFeedback
} from 'react-native'

// custom
import TabNavigator from 'react-native-tab-navigator';
import Styles from './Styles/ContactsScreenStyle'
import {Images, Colors} from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonActions from '../Redux/CommonRedux'
import WebIMActions from '../Redux/WebIMRedux'
import RosterActions from '../Redux/RosterRedux'
import GroupActions from '../Redux/GroupRedux'
import SubscribeActions from '../Redux/SubscribeRedux'
import MessageScreen from './MessageScreen'
// import {Actions as NavigationActions} from 'react-native-router-flux'
import Button from '../Components/Button'
import BaseListView from '../Components/BaseListView'
import Emoji from 'react-native-emoji'
import WebIM from '../Lib/WebIM'
import ApiUtils from '../../util/ApiUtils'
import { toastShort } from '../../util/ToastUtil';

class ContactsScreen extends React.Component {

  // ------------ init -------------

  constructor(props) {
    super(props)

    this.state = {
      isRefreshing: false,
      modalVisible: false,
      focused: false,
      search: '',
      selectedTab: 'contacts',
      notifyCount: 0,
      presses: 0,
      userList:[],
      isGetUserStruct: false,
      userStruct: [],
      data: {
        // [群组通知，好友通知, 通知总数]
        // notices: [null,subscribes, length],
        notices: [],
        // 作为Groups的快捷按钮使用
        groupHeader: ['INIT'],
        friends: [],
        groups: [],
      }
    }
  }

  _renderDate(time) {
    const d = new Date(time)
    return `${d.getMonth() + 1}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()  } ${d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`
  }

  _renderTxt(txt) {
    const emoji = WebIM.emoji

    // 替换不能直接用replace，必须以数组组合的方式，因为混合着dom元素
    let rnTxt = []
    let match = null
    const regex = /(\[.*?\])/g
    let start = 0
    let index = 0
    while (match = regex.exec(txt)) {
      index = match.index
      if (index > start) {
        rnTxt.push(txt.substring(start, index))
      }
      if (match[1] in emoji.map) {
        rnTxt.push((
          <Emoji style={{marginBottom: 3}} key={`emoji-${index}-${match[1]}`} name={emoji.map[match[1]]}/>
        ))
      } else {
        rnTxt.push(match[1])
      }
      start = index + match[1].length
    }
    rnTxt.push(txt.substring(start, txt.length))

    return rnTxt
  }

  getUsersData(ids){
    const {login} = this.props;
    var REQUEST_URL = ApiUtils.getUrl() + '/users.json?ids=' + ids.join(",");
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errors){
        toastShort(responseData.errors.join(","));
      }else{
        this.setState({
          isGetUserStruct: false,
          userStruct: responseData,
        }

        )
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
    });

  }

  getUserIdsFromGroup(groups) {
    let userIds = [];
    groups.names.forEach((v) => {
      let groupData = {};
      let roomId = groups.byName[v].roomId;
      groupData.id = roomId;
      let roomMessageData = message.groupchat[roomId];
      let lastMessageId = roomMessageData[roomMessageData.length - 1]
      let lastMessageBody = message.byId[lastMessageId].body;
      if(lastMessageBody.type === 'txt'){
        groupData.lastMessage = lastMessageBody.msg;
      }else{
        groupData.lastMessage = '[图片]';
      }
      groupData.lastTime = this._renderDate(message.byId[lastMessageId].time);
      groupData.lastTimeReal = message.byId[lastMessageId].time;
      groupData.name = v;
      groupData.company_name = v;
    })
  }


  updateList(props, search = '') {
    props = props || this.props;
    let roster = props.roster || []
    let subscribes = props.subscribes || []
    let friends = roster && roster.friends
    let friendsFilter = friends
    let groups = props.groups || []

    var tmp_friends_list = [];
    let groupList = [];
    var message = this.props.message;

    var userIds = [];
    friendsFilter.forEach((v) => {
      userIds.push(v)
    })

    let groupIds  = [];
    groups.roomIds.forEach((v) => {
      let roomId = groups.byName[v].roomId;
      groupIds.push(roomId);
    })

    const {login} = this.props;

    var REQUEST_URL = ApiUtils.getUrl() + '/user_company_talks.json?group_ids=' + groupIds.join(",");

    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errors){
        toastShort(responseData.errors.join(","));
      }else{
        let roomchatStruct = {};
        responseData.forEach((v) => {
          let FromUser;
          let ToUser;
          if(v.im_id == login.userData.id){
            FromUser = v.im_user;
            ToUser = v.user;
          }else{
            FromUser = v.user;
            ToUser = v.im_user;
          }
          roomchatStruct[v.group_id] = {
            company: v.company,
            FromUser: FromUser,
            ToUser: ToUser,
          }
        })
        // TODO 抽出业务
        groups.roomIds.forEach((v) => {
          let groupData = {};
          let roomId = groups.byName[v].roomId;
          groupData.id = roomId;
          groupData.promptCount = groups.byName[v].promptCount;
          groupData.FromUser = roomchatStruct[roomId].FromUser;
          groupData.ToUser = roomchatStruct[roomId].ToUser;
          groupData.company = roomchatStruct[roomId].company;

          let roomMessageData = message.groupchat[roomId];
          if(roomMessageData){
            let lastMessageId = roomMessageData[roomMessageData.length - 1]
            let lastMessageBody = message.byId[lastMessageId].body;
            let lastMessageUserName = '';
            let lastMessageFrom = message.byId[lastMessageId].from
            if(lastMessageFrom == login.userData.id){
              lastMessageUserName = '我:';
            }else{
              lastMessageUserName = (groupData.FromUser.id == lastMessageFrom ? groupData.FromUser.person_name : groupData.ToUser.person_name ) + ":"
            }
            if(lastMessageBody.type === 'txt'){
              groupData.lastMessage = lastMessageUserName + lastMessageBody.msg;
            }else{
              groupData.lastMessage = lastMessageUserName + '[图片]';
            }
            groupData.lastTime = this._renderDate(message.byId[lastMessageId].time);
            groupData.lastTimeReal = message.byId[lastMessageId].time;
          }else{
            groupData.lastMessage = '';
            groupData.lastTime = ''; 
          }

          groupList.push(groupData);
        })

        let sortByData = function(obj1, obj2) {
          let date1 = obj1.lastTime;
          let date2 = obj2.lastTime;
          if(date1 == ''){
            return 1;
          }else{
            return Date.parse(date2) - Date.parse(date1)  
          } 
        }
        groupList.sort(sortByData)

        this.setState({
          data: {
            notices: [null, subscribes, Object.keys(subscribes).length > 0],
            groupHeader: ['INIT'],
            friends: tmp_friends_list,
            groups: groupList,
          }
        })
      }
    });
    // }).catch((error)=> {
    //   toastShort('服务器出错啦');
    // });
  }

  // ------------ lifecycle ------------
  componentDidMount() {
    this.updateList()
  }

  componentWillReceiveProps(nextProps) {
    // TODO: 是否需要更新的校验
    // TODO: props更新，有没有更好的方式通知
    this.updateList(nextProps, this.state.search)
  }

  // ------------ handlers -------------
  handleRefresh() {
    this.setState({isRefreshing: true})
    this.props.getContacts()
    // TODO: 刷新成功/刷新失败
    setTimeout(() => {
      this.setState({isRefreshing: false})
    }, 1000)
  }

  handleSelectSearch() {
    this.refs.search && this.refs.search.focus()
    this.setState({focused: true})
  }

  handleChangeSearch(text) {
    this.setState({search: text})
    this.updateList(false, text)
  }

  handleFocusSearch() {
    this.setState({focused: true})
  }

  handleBlurSearch() {
    this.refs.search.blur()
    this.setState({focused: false})
  }

  handleCancelSearch() {
    this.refs.search.blur()
    this.setState({
      focused: false,
      search: null,
    })
    this.updateList()
  }

  handleInitSearch() {
    this.setState({
      search: null,
    })
    this.updateList()
  }

  handleDecline(name) {
    this.props.declineSubscribe(name)
  }

  handleAccept(name) {
    this.props.acceptSubscribe(name)
  }

  // ------------ renders -------------
  _renderContent() {
    return (
      <View style={[Styles.container, costomStyles.container]}>
        <BaseListView
          autoScroll={false}
          data={this.state.data}
          handleRefresh={ () => this.handleRefresh()}
          renderRow={ (rowData, sectionId, rowID, highlightRow) => this._renderRow(rowData, sectionId, rowID, highlightRow)}
          renderSeparator={ () => this._renderSeparator()}
        />
      </View>
    )
  }

  _renderRow(rowData, sectionId, rowID, highlightRow) {
    switch (sectionId) {
      case 'groups':
        return this._renderSectionGroup(rowData)
        break;
      case 'friends':
        return this._renderSectionFriends(rowData)
        break;
      // case 'groupHeader':
      //   return this._renderSectionGroupHeader(rowData)
      //   break;
      case 'notices':
        // 无通知消息
        if (rowData == null) return null
        // 空白分割行，参数是未读消息数目
        if (typeof rowData == 'boolean') return rowData ? this._renderSectionNoticesSpace() : null
        // 有通知消息
        return this._renderSectionNotices(rowData)
        break;
      default:
        return null
        break;
    }
  }

  _clickToMessageScreent(uid, chatType, company, FromUser, ToUser) {
    const {navigator} = this.props;
    if(navigator) {
      this.props.cleanPromptCount(uid);
      navigator.push({
        index: 1,
        component: MessageScreen,
        title: 'Home',
        params: {
          id: uid,
          chatType: chatType,
          type: 'replace',
          company: company,
          FromUser: FromUser,
          ToUser: ToUser,
        }
      })
    }
  }

  _renderSectionFriends(rowData) {
    return (
      <TouchableOpacity onPress={()=>this._clickToMessageScreent(rowData.id, 'chat', rowData.company, rowData.avatar)}>
        <View>
          <View style={Styles.row}>
            <Image source={{uri: rowData.avatar}} resizeMode='cover' style={Styles.rowLogo}/>
            <View style={Styles.rowName}>
              <View style={Styles.rowNameTopLine}>
              <Text style={Styles.rowNameTop}>{rowData.name}</Text>
              <Text style={Styles.rowNameTime}>{rowData.lastTime}</Text>
              </View>
              <Text style={Styles.rowNameBottom}>{this._renderTxt(rowData.lastMessage.length > 17 ? (rowData.lastMessage.substr(0,17)+ '...') : rowData.lastMessage)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSectionGroup(rowData) {
    let promptStyle = [];
    if(rowData.promptCount > 0 ){
      promptStyle = [Styles.promptPoint, costomStyles.promptPoint];
    }else{
      promptStyle = [Styles.promptPoint, costomStyles.promptPointHide];  
    }
    return (
      <TouchableOpacity onPress={()=>this._clickToMessageScreent(rowData.id, 'groupchat', rowData.company, rowData.FromUser, rowData.ToUser)}>
        <View>
          <View style={Styles.row}>
            <Image source={{uri: rowData.company.logo}} resizeMode='cover' style={Styles.rowLogo}/>
            <View style={promptStyle}></View>
            <View style={Styles.rowName}>
              <View style={Styles.rowNameTopLine}>
              <Text style={Styles.rowNameTop}>{rowData.company.name}</Text>
              <Text style={Styles.rowNameTime}>{rowData.lastTime}</Text>
              </View>
              <Text style={Styles.rowNameBottom}>{this._renderTxt(rowData.lastMessage.length > 17 ? (rowData.lastMessage.substr(0,17)+ '...') : rowData.lastMessage)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )    
  }

  _renderSectionNotices(rowData) {
    let keys = Object.keys(rowData)
    if (keys.length == 0) return null
    return (
      <View>
        <View style={Styles.noticeHeaderWrapper}>
          <View style={Styles.noticeHeaderLeft}>
            <Image source={Images.requestsIcon}/>
          </View>
          <View style={Styles.noticeHeaderMiddle}>
            <Text style={Styles.noticeHeaderText}>contactRequests</Text>
          </View>
          <View style={Styles.noticeHeaderRight}>
            <Text
              style={[Styles.noticeHeaderText, Styles.noticeHeaderTextRight]}>{keys.length > 0 ? `(${keys.length})` : ''}</Text>
          </View>
        </View>
        {this._renderSectionnoticesRequests(rowData)}
      </View>
    )
  }

  _renderSectionNoticesSpace() {
    // console.log('gogoogo')
    return (
      <View style={{height: 30, backgroundColor: '#e4e9ec'}}>
      </View>
    )
  }

  _renderSectionnoticesRequests(rowData) {
    let requests = []
    let keys = Object.keys(rowData);

    keys.forEach((k) => {
      v = rowData[k]
      requests.push(
        <View key={`request-${k}`}>
          <View style={Styles.row}>
            <Image source={Images.default} resizeMode='cover' style={Styles.rowLogo}/>
            <View style={Styles.rowName}>
              <Text>{v.from}</Text>
            </View>
            <View style={Styles.buttonGroup}>
              <Button
                styles={Styles.accept}
                onPress={() => {
                  this.handleAccept(v.from)
                }}
                text={'accept'}
                color={Colors.snow}
                backgroundColor={Colors.buttonGreen}/>
              <Button
                styles={Styles.decline}
                onPress={() => {
                  this.handleDecline(v.from)
                }}
                text={'decline'}
                color={Colors.snow}
                backgroundColor={Colors.buttonGrey}
              />
            </View>
          </View>
        </View>
      )
    })
    return requests
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    // only friends list needed separator line
    // 只有好友列表才需要分割线
    if (sectionID != 'friends') return null;
    return (
      // backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
      <View
        key={`${sectionID}-${rowID}`}
        style={Styles.separator}/>
    )
  }

  _renderSecondPageTab(selectedTab, title, customStyle) {
    return (
      <TabNavigator.Item 
        selected={true}
        onPress={() => this.setState({ topSelectTab: selectedTab })}
        titleStyle={[costomStyles.topTabTitle, customStyle]}
        selectedTitleStyle={costomStyles.topTabSelectTitle}
        title={title} >
        {this._renderContent()}
      </TabNavigator.Item>
    )
  }

  // ------------ rende -------------
  render() {
    return(
      <TabNavigator tabBarStyle={costomStyles.topTabBar} sceneStyle={ {paddingBottom: 0} }>
        {this._renderSecondPageTab('message', '消息', costomStyles.topTabLeft)}
      </TabNavigator>
    )
  }
}


ContactsScreen.propTypes = {
  roster: PropTypes.shape({
    names: PropTypes.array
  })
}

const PROMPT_SIZE = 8;

var costomStyles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 64,
  },
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
  promptPointHide:{

  },
  promptPoint: {
    borderRadius: PROMPT_SIZE/2,
    width: PROMPT_SIZE,
    height: PROMPT_SIZE,
    backgroundColor: '#E62E46',
    borderColor: "#E62E46",
    borderWidth: 1,
  },
})

// ------------ redux -------------
const mapStateToProps = (state) => {
  return {
    roster: state.entities.roster,
    subscribes: state.entities.subscribe.byFrom,
    groups: state.entities.groups,
    user: state.ui.login.username,
    message: state.entities.message,
    login: state.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cleanPromptCount: (id) => dispatch(GroupActions.cleanCount(id)),
    getContacts: () => dispatch(RosterActions.getContacts()),
    addContact: (id) => dispatch(RosterActions.addContact(id)),
    acceptSubscribe: (name) => dispatch(SubscribeActions.acceptSubscribe(name)),
    declineSubscribe: (name) => dispatch(SubscribeActions.declineSubscribe(name)),
    logout: () => dispatch(WebIMActions.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen)
