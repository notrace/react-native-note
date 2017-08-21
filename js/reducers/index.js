'use strict';
import {combineReducers} from 'redux';
import login from './LoginReducer';
import user from './UserReducer';
import phone from './PhoneReducer';
const rootReducer = combineReducers({
      login,
      user,
      phone,
      entities: combineReducers({
        roster: require('../easemob/Redux/RosterRedux').reducer,
        subscribe: require('../easemob/Redux/SubscribeRedux').reducer,
        groups: require('../easemob/Redux/GroupRedux').reducer,
        message: require('../easemob/Redux/MessageRedux').reducer,
      }),
      ui: combineReducers({
        common: require('../easemob/Redux/CommonRedux').reducer,
        login: require('../easemob/Redux/LoginRedux').reducer,
        contacts: require('../easemob/Redux/ContactsScreenRedux').reducer,
      }),
      im: require('../easemob/Redux/WebIMRedux').reducer
})
export default rootReducer;