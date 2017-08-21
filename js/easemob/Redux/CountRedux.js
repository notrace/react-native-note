'use strict';
import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from '../Lib/WebIM'


const {Types, Creators} = createActions({
  addCount: ['message']
  cleanCount: ['chatType', 'chatId']

})

export const MessageTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  byId: {},
  chat: {},
  groupchat: {},
  extra: {}
})

/* ------------- Reducers ------------- */
/**
 * 添加信息
 * @param state
 * @param message object `{data,error,errorCode,errorText,ext:{weichat:{originType:webim}},from,id,to,type}`
 * @param bodyType enum [txt]
 * @returns {*}
 */
export const addMessage = (state, {message, bodyType = 'txt', username}) => {
  // !message.status && (message = parseFromServer(message, bodyType))
  // console.log("!1111111111")
  // console.log(INITIAL_STATE)
  // console.log("@22222222222")
  // console.log(state)
  // const {username = ''} = state.user || {}
  // const {type, id, to, status} = message
  // // 消息来源：没有from默认即为当前用户发送
  // const from = message.from || username
  // // 当前用户：标识为自己发送
  // const bySelf = from == username
  // // 房间id：自己发送或者不是单聊的时候，是接收人的ID， 否则是发送人的ID
  // const chatId = bySelf || type !== 'chat' ? to : from
  // state = state.setIn(['byId', id], {
  //   ...message,
  //   bySelf,
  //   time: +new Date(),
  //   status: status,
  // })
  // const chatData = state[type] && state[type][chatId] ? state[type][chatId].asMutable() : []
  // chatData.push(id)

  // state = state
  //   .setIn([type, chatId], chatData)
  // return state
  console.log(">>>>>>>>>>>addMessage state <<<<<<<<<<")
  console.log(state)
  
  !message.status && (message = parseFromServer(message, bodyType))
  // const {username = ''} = username || {}
  const {type, id, to, status} = message
  // 消息来源：没有from默认即为当前用户发送
  const from = message.from || username
  // 当前用户：标识为自己发送
  const bySelf = from == username;
  // 房间id：自己发送或者不是单聊的时候，是接收人的ID， 否则是发送人的ID
  const chatId = bySelf || type !== 'chat' ? to : from
  var tmpState = Object.assign({}, state)
  tmpState.byId[id] = {
    ...message,
    bySelf,
    time: +new Date(),
    status: status,
  }
  // tmpState = Object.assign({}, state, tmpState)
  const chatData = tmpState[type] && tmpState[type][chatId] ? tmpState[type][chatId] : []
  chatData.push(id)

  tmpState[type][chatId] = chatData;
  // tmpState.chat[chatId] = chatData;

  state = Object.assign({}, state, tmpState)

  return state
}

export const clearMessage = (state) => {
  return {
    byId: {},
    chat: {},
    groupchat: {},
    extra: {}
  }

}

/**
 * updateMessageStatus 更新消息状态
 * @param state
 * @param message object
 * @param status enum [sending, sent ,fail]
 * @returns {*}
 */
export const updateMessageStatus = (state, {message, status = ''}) => {
  const {id} = message

  // return state
  //   .setIn(['byId', id, 'status'], status)
  //   .setIn(['byId', id, 'time'], +new Date())
  var tmpState = Object.assign({}, state)
  tmpState.byId[id].status = status;
  tmpState.byId[id].time = +new Date();
  state = Object.assign({}, state, tmpState)

  return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_MESSAGE]: addMessage,
  [Types.UPDATE_MESSAGE_STATUS]: updateMessageStatus,
  [Types.CLEAR_MESSAGE]: clearMessage,
})

/* ------------- Selectors ------------- */
