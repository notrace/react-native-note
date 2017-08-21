import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native';
import update from 'react-addons-update';
import TradeCheckCell from './TradeCheckCell';
import FinanceStageCheckCell from './FinanceStageCheckCell';
import RegionCheckCell from './RegionCheckCell';
import ApiUtils from './js/util/ApiUtils'
import ViewUtils from './js/util/ViewUtils'
import { toastShort } from './js/util/ToastUtil';
import { connect } from 'react-redux';

var REQUEST_URL = ApiUtils.getUrl() + '/discover.json';
class DiscoverContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradesDataSource: [],
      financeStagesDataSource: [],
      regionsDataSource: [],
      isLoading: false,
      isLoadingFail: false,
      isSelectAll: false,
      isRegionSelect0: true,
      isFinanceStageSelect0: true,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();  
  }

  fetchData() {
    const {login} = this.props;
    this.setState({
      isLoading: true,
      isLoadingFail: false,
    });
    fetch(REQUEST_URL,{
      method: 'GET',
      headers: ApiUtils.receveHeaders(login.authData),
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errors){
        toastShort(responseData.errors.join(","));
      }else{
      }
      this.setState({
        tradesDataSource: responseData.trades,
        financeStagesDataSource: responseData.financeStages,
        regionsDataSource: responseData.regions,
      });
      this.checkTradeSelect();
    }).catch((error)=> {
      toastShort('服务器出错啦');
      this.setState({
        isLoading: false,
        isLoadingFail: true,
      });
    });
  }

  sendTradeSelectAll(isSelect){
    var method = "PATCH";
    var request_url = this.state.tradesDataSource[0].url+'?change_all=true';
    var data = {
      id: this.state.tradesDataSource[0].id,
      isSelect: isSelect,
    };
    const {login} = this.props;
    headers = ApiUtils.receveHeaders(login.authData);
    ApiUtils.sendRequest(request_url, data, method, headers);
  }

  sendTradeSelect(i, isSelect){
    var method = "PATCH";
    var request_url = this.state.tradesDataSource[i].url;
    var data = {
      id: this.state.tradesDataSource[i].id,
      isSelect: isSelect,
    };
    const {login} = this.props;
    var headers = ApiUtils.receveHeaders(login.authData);
    ApiUtils.sendRequest(request_url, data, method, headers);
  }

  sendFinanceStageSelect(i, isSelect){
    var method = "PATCH";
    var request_url = this.state.financeStagesDataSource[i].url;
    var data = {
      id: this.state.financeStagesDataSource[i].id,
      isSelect: isSelect,
    };
    const {login} = this.props;
    var headers = ApiUtils.receveHeaders(login.authData);
    ApiUtils.sendRequest(request_url, data, method, headers);
  }

  sendRegionSelect(i, isSelect){
    var method = "PATCH";
    var request_url = this.state.regionsDataSource[i].url;
    var data = {
      id: this.state.regionsDataSource[i].id,
      isSelect: isSelect,
    };
    const {login} = this.props;
    var headers = ApiUtils.receveHeaders(login.authData);
    ApiUtils.sendRequest(request_url, data, method, headers);
  }


  renderTradeFirst() {
    if(this.state.isSelectAll) {
      var rightButton = 
        <TouchableHighlight style={styles.tradeFollowAllButton} onPress={()=>this.changeAllTradeSelect(false)} underlayColor='transparent'>
          <View>
            <Text style={styles.tradeUnFollowAllButtonText}>
              清空
            </Text>
          </View>
        </TouchableHighlight>;
    }else{
      var renderIcon = require('./res/images/icon/follow_icon.png');
      var rightButton = 
        <TouchableHighlight style={styles.tradeFollowAllButton} onPress={()=>this.changeAllTradeSelect(true)} underlayColor='transparent'>
          <View style={styles.tradeFollowAllButtonView}>
            <Image style={styles.tradeFollowAllButtonIcon} source={renderIcon} />
            <Text style={styles.tradeFollowAllButtonText}>
              关注
            </Text>
          </View>
        </TouchableHighlight>;
    }
    return rightButton;
  }

  renderTradeView(){
    if (!this.state.tradesDataSource || this.state.tradesDataSource.length === 0)return;
    var len = this.state.tradesDataSource.length;
    var viewsLeft = [];
    var viewsRight = [];
    for (var i = 0, l = len; i < l; i += 2) {
      var positionType = 'normal';
      var styleString = styles.item;
      if(i == 0){
        styleString = styles.item;
        positionType = 'first';
      }
      if(i == l - 2){
        styleString = styles.lastItem;
        positionType = 'last';
      };

      viewsLeft.push(
        <View key={'trade'+i} style={styleString}>
          {this.renderTradeCheck(this.state.tradesDataSource[i], i, positionType)}
        </View>
      );
      if(this.state.tradesDataSource[i + 1]){
        viewsRight.push(
          <View key={'trade'+i+1} style={styleString}>
            {this.renderTradeCheck(this.state.tradesDataSource[i + 1], i+1, positionType)}
          </View>
        )        
      }

    }
    return(
      <View style={{flexDirection:'row'}}>
        <View style={styles.tradeItemsLeft}>
          {viewsLeft}
        </View>
        <View style={styles.tradeItemsRight}>
          {viewsRight}
        </View>
      </View>
    );
  }

  checkTradeSelect() {
    var isSelectAll = true;
    var len = this.state.tradesDataSource.length;
    for (var i = 0, l = len; i < l; i ++) {
      if (!this.state.tradesDataSource[i].isSelect) {
        isSelectAll = false;
        break;
      }
    };
    this.setState({
      isSelectAll: isSelectAll,
    });  
  }

  changeAllTradeSelect(isSelect) {
    this.sendTradeSelectAll(isSelect);
    var newTradeArr = this.state.tradesDataSource;
    var len = this.state.tradesDataSource.length;
    for (var i = 0, l = len; i < l; i ++) {
      newTradeArr[i].isSelect = isSelect;
    };
   this.setState({
      tradesDataSource : this.state.tradesDataSource,
    })
   this.checkTradeSelect();
  }

 renderTradeCheck(trade, key, positionType) {
    return(
      <TradeCheckCell ref={'trade'+key} trade={trade} arrayNum={key} onTradeSelect={(key, isSelect)=>this.onTradeSelect(key, isSelect)} positionType={positionType}/>
    )
  }

  renderFinanceStageCheck(financeStage, key){
    return(
      <FinanceStageCheckCell key={'financeStage'+key} ref={'financeStage'+key} financeStage={financeStage} arrayNum={key} onFinanceStageSelect={(key, isSelect)=>this.onFinanceStageSelect(key, isSelect)}/>
    )
  }

  renderRegionCheck(region, key){
    return(
      <RegionCheckCell key={'region'+key} ref={'region'+key} region={region} arrayNum={key} onRegionSelect={(key, isSelect)=>this.onRegionSelect(key, isSelect)}/>
    )
  }

  renderTrade() {
    return (
      <View style={styles.tradeList}>
        <View style={styles.tradeListFirst}>
          <Text style={styles.tradeFollowAllText}>
            一键关注全部行业
          </Text>
          {this.renderTradeFirst()}
        </View>
        {this.renderTradeView()}
      </View>
    ); 
  }

  renderFinanceStage() {
    if (!this.state.financeStagesDataSource || this.state.financeStagesDataSource.length === 0)return;
    var len = this.state.financeStagesDataSource.length;
    var views = [];
    for (var i = 0, l = len; i < l; i += 4) {
      var items = [];
      for(var j = i, e = i+4; j < e && j < l; j++){
        items.push(this.renderFinanceStageCheck(this.state.financeStagesDataSource[j], j))
      }
      if(i+4 > l){
        for(var k = l, end = i + 4; k < end; k++){
          items.push(
            <View style={styles.financeStageCheck} key={k}>
            </View>
          )
        }
      }

      views.push(
        <View style={styles.financeStageLine} key={i}>
          {items}
        </View>
      );
    }
    return(
      <View style={{flexDirection:'row'}}>
        <View style={styles.financeStageList}>
            {views}
        </View>
      </View>
    )
  }

  renderRegion() {
    if (!this.state.regionsDataSource || this.state.regionsDataSource.length === 0)return;
    var len = this.state.regionsDataSource.length;
    var views = [];
    for (var i = 0, l = len; i < l; i += 4) {
      var items = [];
      for(var j = i, e = i+4; j < e && j < l; j++){
        items.push(this.renderRegionCheck(this.state.regionsDataSource[j], j))
      }
      if(i+4 > l){
        for(var k = l, end = i + 4; k < end; k++){
          items.push(
            <View style={styles.regionCheck} key={k}>
            </View>
          )
        }
      }

      views.push(
        <View style={styles.regionLine} key={i}>
          {items}
        </View>
      );
    }
    return(
      <View style={{flexDirection:'row'}}>
        <View style={styles.regionList}>
            {views}
        </View>
      </View>
    )
  }

  onTradeSelect(i, isSelect) {
    this.sendTradeSelect(i, isSelect);
    this.checkTradeSelect();
  }

  onFinanceStageSelect(i, isSelect){
    var isFinanceStageSelect0 = true;
    if(i == 0){
      isFinanceStageSelect0 = true;   
      this.state.financeStagesDataSource[0].isSelect = true;
      var len = this.state.financeStagesDataSource.length;
      for (var j = 1, l = len; j < l; j ++) {
        this.state.financeStagesDataSource[j].isSelect = false;
      }
    }else{
      this.state.financeStagesDataSource[0].isSelect = false;
      isFinanceStageSelect0 = false;
    }
    this.sendFinanceStageSelect(i, isSelect);
    this.setState({

    });
  }

  onRegionSelect(i, isSelect){
    var isRegionSelect0 = true;
    if(i == 0){
      isRegionSelect0 = true;   
      this.state.regionsDataSource[0].isSelect = true;
      var len = this.state.regionsDataSource.length;
      for (var j = 1, l = len; j < l; j ++) {
        this.state.regionsDataSource[j].isSelect = false;
      }
    }else{
      this.state.regionsDataSource[0].isSelect = false;
      isRegionSelect0 = false;
    }
    this.sendRegionSelect(i, isSelect);
    this.setState({
      isRegionSelect0: isRegionSelect0
    });

  }

  render() {
    return (
        <View style={styles.discoverContainer}>
          {ViewUtils.pageMsg("点击关注后，首页项目列表将为您推送相关项目")}
          <ScrollView>
            <View style={styles.discoverTitle}>
              <Text style={styles.discoverTitleText}>行业分类</Text>
            </View>
            {this.renderTrade()}
            <View style={styles.discoverTitle}>
              <Text style={styles.discoverTitleText}>融资阶段</Text>
            </View>
            {this.renderFinanceStage()}
            <View style={styles.discoverTitle}>
              <Text style={styles.discoverTitleText}>地区</Text>
            </View>
            {this.renderRegion()}
          </ScrollView>
        </View>
    );
  }

}

var styles = StyleSheet.create({
  topTabBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#24AE95',
    height: 64,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  discoverContainer: {
    flex: 1,
    marginVertical: 64,
    marginBottom: 0,
    backgroundColor: '#f3f3f4',
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  discoverTitle: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingLeft: 10,
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  discoverTitleText: {
    flex: 1,
    fontSize: 17,
    color: '#909090',
  },
  tradeList: {
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  tradeListFirst: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  tradeFollowAllText: {
    flex: 1,
    fontSize: 16,
    color: '#404040',
    justifyContent: 'flex-start',
  },
  tradeFollowAllButton: {
    justifyContent: 'flex-end',
  },
  tradeFollowAllButtonView: {
    height: 20,
    width: 50,
    borderRadius: 2,
    backgroundColor: '#24AE95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeUnFollowAllButtonText: {
    color: '#24AE95',
    fontSize: 12,
  },
  tradeFollowAllButtonIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  tradeFollowAllButtonText: {
    fontSize: 12,
    color: 'white',
  },
  tradeItemsLeft: {
    flex: 1,
    marginTop: 14,
    marginBottom: 14,
    paddingRight: 10,
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderRightWidth: 0.5,
  },
  tradeItemsRight: {
    flex: 1,
    marginTop: 14,
    marginBottom: 14,
    paddingLeft: 10,
  },
  item: {
    flexDirection: 'row',
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  lastItem: {
    flexDirection: 'row',
  },
  financeStageList: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  financeStageLine:{
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  financeStageCheck: {
    flex: 1,
    flexDirection: 'row',
    marginLeft:8,
    marginRight:8,
    marginTop:9,
    marginBottom:9,
  },
  regionList: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: '#E0E0E0',
    borderStyle: null,
    borderBottomWidth: 0.5,
  },
  regionLine:{
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  regionCheck: {
    flex: 1,
    flexDirection: 'row',
    marginLeft:8,
    marginRight:8,
    marginTop:9,
    marginBottom:9,
  },
});
function mapStateToProps(state) {
  const { login } = state;
  return {
    login
  }
}
export default connect(mapStateToProps)(DiscoverContent);