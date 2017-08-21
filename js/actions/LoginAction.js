/**
 * 用户登录Action操作
 */
'use strict';
import * as types from '../common/ActionTypes';
import { toastShort } from '../util/ToastUtil';
import ApiUtils from '../util/ApiUtils';
import {Alert} from 'react-native';

var REQUEST_URL = ApiUtils.getUrl() + '/auth/sign_in';
var REGISTER_REQUEST_URL = ApiUtils.getUrl() + '/auth';

// export function performLoginAction(username,password){
        // client.addMiddleware(form());
        //              client.addMiddleware(request => {
        //              request.options.headers['appkey'] = '8a9283a0567d5bea01567d5beaf90000';
        //           });
        //       client.post(LOGIN_ACTION, {
        //           form: {
        //             username: username,
        //             password: password,
        //          },
        //       }).then(response => {
        //          return response.json();
        //       }).then((result)=>{
        //          dispatch(receiveLoginResult(result));
        //          if(result.code === '0'){
        //              //登录成功..
        //              toastShort('登录成功...'); 
        //          }else{
        //              toastShort(result.msg);
        //          }
        //       }).catch((error) => {
        //          toastShort('网络发生错误,请重试!') 
        //       });
//      }
// }
/*
var resultData = {};
resultData= {
  authData: response,
  userData: json
}
dispatch(receiveLoginResult(resultData)); 
*/
export function performSaveLoginDataAction(response){
  return dispatch => {
    dispatch(receiveLoginResult(response));
  }
}

export function performRefreshTokenAction(response){
  return dispatch => {
    dispatch(refreshToken(response));
  }
}
export function performSaveUserDataAction(response){
  return dispatch => {
    dispatch(saveUserData(response));
  }
}
export function performClickGoToHomeAction(){
  return dispatch => {
    dispatch(changeHasSeeResultOk());
  }
}
export function performDeleteLoginDataAction(response){
  return dispatch => {
    dispatch(logout());
  }
}

function refreshToken(result){
  return {
    type: types.REFRESH_TOKEN_ACTION,
    data: result
  }
}

export function receiveLoginResult(result){
  return {
    type: types.RECEIVE_LOGIN_ACTION,
    data: result
  }
}
function saveUserData(result){
  return {
    type: types.SAVE_USER_DATA,
    data: result
  }
}
function changeHasSeeResultOk(){
  return {
    type: types.CHANGE_HAS_SEE_RESULT_OK,
  }
}
function logout(){
  return {
    type: types.PERFORM_LOGOUT_ACTION,
  } 
}