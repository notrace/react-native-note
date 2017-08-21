'use strict';
import React, {Component,PropTypes} from 'react';
import{ 
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Platform,
    NativeModules,
    ToastAndroid,
} from 'react-native';

import Register from './Register';
import { Redirect } from 'react-router-native'
import ShortLineTwo from '../component/ShortLineTwo';
import { connect } from 'react-redux';
import { performRefreshTokenAction,performSaveUserDataAction } from '../actions/LoginAction'
import { performGetAction } from '../actions/UserAction'
import Loading from '../component/Loading_DD';
import ApiUtils from '../util/ApiUtils'
import ViewUtils from '../util/ViewUtils';
import ImagePicker from 'react-native-image-picker';
import { toastShort } from '../util/ToastUtil';

var options = {
  title: '', // 选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 100, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
  maxHeight: 100, // photos only
  allowsEditing: false, // 当用户选择过照片之后是否允许再次编辑图片
};

var UPLOAD_CARD_URL = ApiUtils.getUrl() + '/people/3';
var REQUEST_URL = ApiUtils.getUrl() + '/users/1';


class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCardSource: null,
      bCardSource: null,
      idCardReady: false,
      bCardReady: false,
      oldIdCardUri: '',
      oldBCardUri: '',
      editCase: false,
      registerLoading: false,
      gotoLogin: false,
    };
  }

  componentDidMount() {
    this.fetchUserData();  
  }

  fetchUserData(){
    const {login,dispatch} = this.props;
    console.log("test header is :")
    console.log(ApiUtils.receveHeaders(login.authData));
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData),
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log("user auth fetch user data json:")
      console.log(json);
      console.log("user auth fetch user data response--------:")
      console.log(response);
      if(response.ok){
        if(login.userData.data.status !== '未认证'){
          dispatch(performGetAction(json));
          console.log("user people data id:");
          console.log(json);
          console.log(json.person);
          this.setState({
            oldIdCardUri: json.person.id_card,
            oldBCardUri: json.person.b_card,
            editCase: true
          });          
        }
      }else{
        toastShort(json.errors.join(","));
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
    });
  }

  selectIdCard(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        // 这是当用户选择customButtons自定义的按钮时，才执行
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        console.log("-------------file path is:");
        console.log(response);
        if (Platform.OS === 'android') {
          var source = {uri: response.uri, isStatic: true};
        } else {
          if (response.uri.includes(".gif")) {
            var source = {uri: 'data:image/' + 'gif' + ';base64,' + response.data, isStatic: true};
          } else if (response.uri.includes(".png")) {
            var source = {uri: 'data:image/' + 'png' + ';base64,' + response.data, isStatic: true};
          } else {
            var source = {uri: 'data:image/' + 'jpeg' + ';base64,' + response.data, isStatic: true};
          }
        }
        this.setState({
          idCardSource: source,
          idCardReady: true,
        });

      }
    });
  }

  selectBCard(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        // 这是当用户选择customButtons自定义的按钮时，才执行
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        if (Platform.OS === 'android') {
          var source = {uri: response.uri, isStatic: true};
        } else {
          if (response.uri.includes(".gif")) {
            var source = {uri: 'data:image/' + 'gif' + ';base64,' + response.data, isStatic: true};
          } else if (response.uri.includes(".png")) {
            var source = {uri: 'data:image/' + 'png' + ';base64,' + response.data, isStatic: true};
          } else {
            var source = {uri: 'data:image/' + 'jpeg' + ';base64,' + response.data, isStatic: true};
          }
        }
        this.setState({
          bCardSource: source,
          bCardReady: true,
        });
      }
    });
  }

  updateCardAction(){
    const {dispatch, login} = this.props;
    if(!this.state.editCase && this.state.bCardSource === null){
      (Platform.OS === 'android') ? ToastAndroid.show('请添加名片...',ToastAndroid.SHORT) : ''; 
      return;
    }
    if(!this.state.editCase && this.state.idCardSource === null){
      (Platform.OS === 'android') ? ToastAndroid.show('请添加身份证...',ToastAndroid.SHORT) : ''; 
      return;
    }
    // if(this.state.editCase && (this.state.idCardSource === null && this.state.bCardSource === null)){
    //   (Platform.OS === 'android') ? ToastAndroid.show('请添加身份证或名片...',ToastAndroid.SHORT) : ''; 
    //   return;
    // }
    this.setState({
      registerLoading: true,
    })
    fetch(UPLOAD_CARD_URL,{
      method: 'PUT',
      headers: ApiUtils.receveHeaders(login.authData),
      body: JSON.stringify({
        'person' : {
        'b_card_base64': this.state.bCardSource ? this.state.bCardSource.uri : '',
        'id_card_base64': this.state.idCardSource ? this.state.idCardSource.uri : '',    
        }
      })
    })
    .then((response) => response.json().then(json => ({ json, response })))
    .then(({json,response}) => {
      console.log(json);
      console.log(response);
      if(response.ok){
        // dispatch(performRefreshTokenAction(response));
        dispatch(performSaveUserDataAction(json));
        this.setState({
          gotoLogin: true,
        });
      }else{
        toastShort(json.errors.join(","));
      }
    }).catch((error)=> {
      toastShort('服务器出错啦');
    });
  }

  renderUploadBtn(){
    if(this.state.idCardReady && this.state.bCardReady){
      var btnStyle = styles.uploadImageBtn;
      var btnDisabled = false;
    }else if(this.state.editCase){
      var btnStyle = styles.uploadImageBtn;
      var btnDisabled = false;
    }else{
      var btnStyle = [styles.uploadImageBtn, styles.disabledBtn];
      var btnDisabled = true;
    }   
    return(
      <TouchableOpacity onPress={() => {this.updateCardAction()}} style={btnStyle} disabled={btnDisabled}>
        <Text style={styles.primaryBtnText}>上传</Text>
      </TouchableOpacity>
    )
  }

  idCardImage(){
    if(this.state.idCardSource != null){
      return(<Image style={styles.uploadedImage} source={this.state.idCardSource} />)
    }else if(this.state.editCase){
      return(<Image style={styles.uploadedImage} source={{uri: this.state.oldIdCardUri}} />)
    }else{
      return <View></View>
    }
  }

  bCardImage(){
    if(this.state.bCardSource != null){
      return(<Image style={styles.uploadedImage} source={this.state.bCardSource} />)
    }else if(this.state.editCase){
      return(<Image style={styles.uploadedImage} source={{uri: this.state.oldBCardUri}} />)
    }else{
      return <View></View>
    }
  }

  onBack() {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack();
    } else {
      this.props.navigator.pop();
    }
  }

  renderHeader() {
    const {login} = this.props;
    if(login.userData.data.status !== '审核成功'){
      return(
        <View style={styles.topTab}>
          <Text style={styles.topTabText}>身份认证</Text>
        </View>
      )
    }else{
      return(
        ViewUtils.getNavBar(()=>this.onBack(), '身份认证')
      )
    }
  }

  render() {
    if(this.state.gotoLogin){
      return(
        <Redirect to={'/'}/>
      )
    }
    return (
      <View style={styles.loginPage}>
        {this.renderHeader()}
        <View style={{}} >
          <Text style={styles.userAuthTitle}>请上传身份证正面照</Text>
          <View style={styles.uploadLine}>
            <TouchableOpacity onPress={() => {this.selectIdCard()}} style={styles.imageUploadField}>
              {this.idCardImage()}
              <Image source={require('../../res/images/icon/idcarduploadtext.png')} 
                     style={styles.idCardUploadIcon}/>
            </TouchableOpacity>
            <View style={styles.imageUploadExampleLine}>
              <Image source={require('../../res/images/icon/idcard.png')} 
                     style={styles.imageUploadExample}/>
              <Text style={styles.imageUploadExampleText}>示例</Text>
            </View>
          </View>
          <Text style={styles.idCardUploadDesc}>请上传原始比例的身份证正面照片，请勿裁剪涂改，保持身份证信息清晰，否则无法通过审核</Text>
          <Text style={styles.userAuthTitle}>请上传名片正面照</Text>
          <View style={styles.uploadLine}>
            <TouchableOpacity onPress={() => {this.selectBCard()}} style={styles.imageUploadField}>
              { this.bCardImage() }
              <Image source={require('../../res/images/icon/bcarduploadtext.png')} 
                     style={styles.idCardUploadIcon}/>
            </TouchableOpacity>
            <View style={styles.imageUploadExampleLine}>
              <Image source={require('../../res/images/icon/bcard.png')} 
                     style={styles.imageUploadExample}/>
              <Text style={styles.imageUploadExampleText}>示例</Text>
            </View>
          </View>
          <Text style={styles.idCardUploadDesc}>请选择包含与身份证姓名一致的名片，尽量包含以下信息：公司、职称、邮箱、微信等</Text>
        </View>
        {this.renderUploadBtn()}
        <Loading visible={this.state.updateLoading} />
        <Loading visible={this.state.codeLoading} />
      </View>
    );
 
  }
}
const styles=StyleSheet.create({
  loginPage:{
    marginTop: (Platform.OS === 'ios') ? 20:0,
    backgroundColor:'#f5f5f5',
    flex:1
  },
  fixHeader:{
    position: 'absolute',
    left: 10,
    top: 7,
  },
  topTab:{
    backgroundColor: 'white',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabText:{
    fontSize: 18,
    color: '#606060',
  },
  bottomLine:{
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  authForm: {
    marginTop: 15,
    backgroundColor:'white',
    justifyContent: 'center',
  },
  userAuthTitle:{
    margin:20,
    fontSize: 17,
    color: '#606060',
  },
  uploadLine:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageUploadField:{
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backfaceVisibility: 'visible',
    width: 180,
    height: 102,
  },
  uploadedImage:{
    width: 180,
    height: 102,
  },
  idCardUploadIcon:{
    width:114,
    height: 60,
    resizeMode: 'contain',
    margin: 15,
    position: 'absolute',
  },
  imageUploadExampleLine:{
    alignItems: 'center',
  },
  imageUploadExample:{
    width: 109,
    height: 68,
    resizeMode: 'contain',
  },
  imageUploadExampleText:{
    marginTop: 8,
    fontSize: 14,
    color: '#606060',
  },
  idCardUploadDesc:{
    color: '#17A2FD',
    fontSize: 13,
    margin:20,
  },
  uploadImageBtn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(36,174,149,40)',
    marginTop:13,
    height: 46,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  disabledBtn:{
    backgroundColor: 'rgba(36,174,149,0.4)',
  },
  primaryBtnText:{
    color: 'white',
    fontSize: 18,
  }
});
function mapStateToProps(state) {
  const { login } = state;
  return {
    login
  }
}
export default connect(mapStateToProps)(UserAuth);