/**
 * 手机号记录
 */
'use strict';
import * as types from '../common/ActionTypes';

const initialState = {
    phoneNum:''

}

export default function phone(state = initialState, action){
    switch (action.type) {
        case types.UPDATE_PHONE:
          return Object.assign({}, state, {
            phoneNum: action.data,
          });
        default:
            return state;
    }
}