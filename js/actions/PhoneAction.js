/**
 * 登录用手机号操作
 */
'use strict';
import * as types from '../common/ActionTypes';
import { toastShort } from '../util/ToastUtil';

export function performUpdatePhone(phoneNum){
  return dispatch => {
    dispatch(update(phoneNum));
  }
}

function update(phoneNum) {
  return {
    type: types.UPDATE_PHONE,
    data: phoneNum
  }
}




