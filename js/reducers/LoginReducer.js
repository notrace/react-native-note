/**
 * 用户登录Reducers
 */
'use strict';
import * as types from '../common/ActionTypes';

const initialState = {
    authData:'',
    userData:'',
    hasSeeResultOk: false,

}

export default function login(state = initialState, action){
    switch (action.type) {
        case types.RECEIVE_LOGIN_ACTION:
          return Object.assign({}, state, {
            authData: action.data.authData,
            userData: action.data.userData
          });
        case types.REFRESH_TOKEN_ACTION:
          return Object.assign({}, state, {
            authData: action.data,
          });
        case types.SAVE_USER_DATA:
          return Object.assign({}, state, {
            userData: action,
          });
        case types.CHANGE_HAS_SEE_RESULT_OK:
          return Object.assign({}, state, {
            hasSeeResultOk: true,
          });
        case types.PERFORM_LOGOUT_ACTION:
          return Object.assign({}, state, {
            authData: '',
            userData: '',
          });
        default:
            return state;
    }
}