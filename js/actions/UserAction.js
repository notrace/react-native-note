/**
 * 用户登录Action操作
 */
'use strict';
import * as types from '../common/ActionTypes';
import { toastShort } from '../util/ToastUtil';
import {Alert} from 'react-native';

export function performGetAction(response){
  console.log(">>>>>>>>>>>user performGetAction<<<<<<<<<")
  console.log(response)
  return dispatch => {
    dispatch(get(response));
  }
}

export function performClearUserDataAction(response){
  return dispatch => {
    dispatch(clear());
  }
}

function get(result) {
  return {
    type: types.FETCH_USER_DATA,
    data: result
  }
}

function clear() {
  return {
    type: types.CLEAR_USER_DATA,
  }
}



