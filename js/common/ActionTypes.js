/**
 * 进行定义请求Action类型
 */
'use strict';

export const PERFORM_LOGIN_ACTION = 'PERFORM_LOGIN_ACTION';  
export const RECEIVE_LOGIN_ACTION = 'RECEIVE_LOGIN_ACTION';  
export const SAVE_USER_DATA = 'SAVE_USER_DATA'; //保存用户信息
export const REFRESH_TOKEN_ACTION = 'REFRESH_TOKEN_ACTION';  
export const CHANGE_HAS_SEE_RESULT_OK = 'CHANGE_HAS_SEE_RESULT_OK';  

export const PERFORM_REGISTER_ACTION = 'PERFORM_REGISTER_ACTION'; //用户注册

export const PERFORM_LOGOUT_ACTION = 'PERFORM_LOGOUT_ACTION'; // 退出登录

//商家详情-商品列表相关的逻辑处理
export const FETCH_GOOS_ACTION = "FETCH_GOOS_ACTION";  //获取商品列表中
export const RECEIVE_GOODS_ACTION = "RECEIVE_GOODS_ACTION";  //获取到商品列表
export const CHANGE_CATEGORY_ACTION = "CHANGE_CATEGORY_ACTION"; //切换列表，显示对应商品列表
//用户详情
export const  FETCH_USER_DATA = 'FETCH_USER_DATA'
export const  CLEAR_USER_DATA = 'CLEAR_USER_DATA'
//手机号
export const  UPDATE_PHONE = 'UPDATE_PHONE'