/**
 * 用户Reducers
 */
'use strict';
import * as types from '../common/ActionTypes';

const initialState = {
  userData:'',
}

export default function user(state = initialState, action){
  switch (action.type) {
    case types.FETCH_USER_DATA:
      return Object.assign({}, state, {
        userData: action,
      });
    case types.CLEAR_USER_DATA:
      return Object.assign({}, state, {
        userData: '',
      });
    default:
        return state;
  }
}