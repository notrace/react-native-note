
import React  from 'react';
import {
    Alert
} from 'react-native';
import { toastShort } from '../util/ToastUtil';

export default class ViewUtils {
  static getUrl() {
    return "http://localhost:3000/api/v1"
  }

  static webUrl() {
    return "http://localhost:3000"
  }

  static receveHeaders(data){
    var headers = {
      'Content-Type': 'application/json;',
      'token-type': 'Bearer',
      'access-token': data.headers.map['access-token'][0],
      'client': data.headers.map['client'][0],
      'expiry': data.headers.map['expiry'][0],
      'uid': data.headers.map['uid'][0],
    }
    return headers;
  }

  static checkStatus(response){
    
  }

  static sendRequest(url, data, method, headers){
    console.log("------- send request headers:");
    console.log(headers);
    fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("--------send Request");
      console.log(responseData);
      if(responseData.errors){
        console.log("----------send request error")
        toastShort(responseData.errors.join(","));
        this.setState({
          message_content: responseData.error,
          message_type: "error",
        });
      }else{
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
    });
  }

}