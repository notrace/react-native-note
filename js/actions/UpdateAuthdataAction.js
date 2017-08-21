/**
 * 用户登录Action操作
 */
'use strict';
import * as types from '../common/ActionTypes';
export function performUpdataAuthdataAction(response){
  return dispatch => {
    dispatch(receiveLoginResult(response));
  }
}


function receiveLoginResult(result){
  return {
      type: types.RECEIVE_LOGIN_ACTION,
      data: result
  }

}