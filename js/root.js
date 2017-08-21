import React, {Component} from 'react';
import{ View 
} from 'react-native';

import {Provider, connect} from 'react-redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import configureStore from './store/configure-store'
import {AsyncStorage} from 'react-native';

import { NativeRouter, Route, Link, replace } from 'react-router-native'

import AuthPage from './pages/AuthPage';
import App from './app';



const store = configureStore(autoRehydrate());
// const store = configureStore();


const persister=persistStore(store, {storage: AsyncStorage}, ()=>{
  console.log('rehydration complete')
});


class rootApp extends Component {

  constructor(){
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}



export default rootApp;