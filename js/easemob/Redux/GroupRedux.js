import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const msgTpl = {
  base: {
    error: false,
    errorCode: '',
    errorText: '',
    // status 为空将被当做服务端的数据处理，处理成sent
    status: 'sending', // [sending, sent ,fail, read]
    id: '',
    // from 不能删除，决定了房间id
    from: '',
    to: '',
    toJid: '',
    time: '',
    type: '', // chat / groupchat
    body: {},
    ext: {},
    bySelf: false,
  },
  txt: {
    type: 'txt',
    msg: ''
  },
  img: {
    type: 'img',
    file_length: 0,
    filename: '',
    filetype: '',
    length: 0,
    secret: '',
    width: 0,
    height: 0,
    url: '',
    thumb: '',
    thumb_secret: ''
  }
}

// 统一消息格式：服务端
function parseFromServer(message = {}, bodyType) {
  let ext = message.ext || {}
  let obj = copy(message, msgTpl.base)
  // body 包含：所有message实体信息都放到body当中，与base区分开
  // body 包含：ext 存放用户自定义信息，比如图片大小、宽高等
  let body = copy(message, msgTpl[bodyType])
  switch (bodyType) {
    case 'txt':
      return {
        ...obj, status: 'sent',
        body: {
          ...body, ...ext, msg: message.data, type: 'txt',
        }
      }
      break;
    case 'img':
      return {
        ...obj, status: 'sent',
        body: {
          ...body, ...ext, type: 'img'
        }
      }
      break;
  }
}

function copy(message, tpl) {
  let obj = {}
  Object.keys(tpl).forEach((v) => {
    obj[v] = message[v] || tpl[v]
  })
  return obj
}

const {Types, Creators} = createActions({
  updateGroupInfo: ['info'],
  updateGroup: ['groups'],
  addCount: ['message', 'bodyType'],
  cleanCount: ['groupId'],
  cleanGroup: [],
  // ---------------async------------------
  getGroups: () => {
    return (dispatch, getState) => {
      WebIM.conn.listRooms({
        success: function (rooms) {
          dispatch(Creators.updateGroup(rooms))
        },
        error: function (e) {
          WebIM.conn.setPresence();
        }
      });
    }
  },
})

export const GroupsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  byName: {},
  byId: {},
  roomIds: [],
  promptCount: 0,
})

/* ------------- Reducers ------------- */
// [{jid,name,roomId}] groups
export const updateGroup = (state, {groups}) => {
  let byName = {};
  let byId = {};
  let roomIds = [];
  let tmpState = Object.assign({}, state)
  groups.forEach((v) => {
    if(tmpState.byId[v.roomId]){
      v.promptCount = tmpState.byId[v.roomId].promptCount;  
    }else{
      v.promptCount =  0;
    }
    byName[v.roomId] = v;
    roomIds = Object.keys(byName).sort();
    byId[v.roomId] = v;
  })
  return {
    byName,
    byId,
    roomIds,
  }
}

export const addCount = (state, {message, bodyType = 'txt',}) => {
  !message.status && (message = parseFromServer(message, bodyType));
  const {type, id, to, status} = message;
  // 消息来源：没有from默认即为当前用户发送
  const from = message.from || username
  const chatId = type !== 'chat' ? to : from
  let tmpState = Object.assign({}, state)
  if(tmpState.byId[chatId]){
    let promptCount = tmpState.byId[chatId].promptCount || 0 ;
    tmpState.byId[chatId].promptCount = promptCount + 1;  
  }
  state = Object.assign({}, state, tmpState)
  return state


}

export const cleanCount = (state, {groupId}) => {
  let tmpState = Object.assign({}, state);
  tmpState.byId[groupId].promptCount = 0;
  state = Object.assign({}, state, tmpState);

  return state
}

export const cleanGroup = (state) => {

  let byName = {};
  let byId = {};
  let roomIds = [];
  return {
    byName,
    byId,
    roomIds,
  }
}

// [{affiliations,description,maxusers,name,occupants,owner}] info
export const updateGroupInfo = (state, {info}) => {
  // let byName = {}
  // let byId = {}
  // state.group.forEach((v) => {
  //   byName[v.name] = v
  //   byId[v.roomId] = v
  // })
  // return state.merge({ 
  //   byName,
  //   byId,
  //   names: Object.keys(byName)
  // })
  state.groups.byName[info.name]
  return {}
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_GROUP]: updateGroup,
  [Types.CLEAN_GROUP]: cleanGroup,
  [Types.ADD_COUNT]: addCount,
  [Types.CLEAN_COUNT]: cleanCount,
})

/* ------------- Selectors ------------- */
