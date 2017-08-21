import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ListView,
  RefreshControl,
  TouchableHighlight,
  View
} from 'react-native';

export default class TradeCheckCell extends Component {
  constructor(props) {
    super(props);
  }

  setSelectState(isSelect) {
    this.props.trade.isSelect = isSelect;
  }

  onPressTradeSelect() {
    var isSelect = this.props.trade.isSelect;
    this.props.onTradeSelect(this.props.arrayNum, !isSelect);
    this.setSelectState(!isSelect);
  }

  render() {
    console.log("-------trade check cell render:");
    console.log(this.props.trade);
    console.log(this.props.isSelect);
    if(this.props.trade.isSelect){
    var rightButton =
      <TouchableHighlight style={styles.tradeCheckButton} onPress={()=>this.onPressTradeSelect()}  underlayColor='transparent'>
        <View style={styles.tradeUnCheckButtonView}>
          <Text style={styles.tradeUnCheckButtonText}>
            已关注
          </Text>
        </View>
      </TouchableHighlight>;
    }else{
      var renderIcon = require('./res/images/icon/follow_icon.png');
      var rightButton = 
        <TouchableHighlight style={styles.tradeCheckButton} onPress={()=>this.onPressTradeSelect()}  underlayColor='transparent'>
          <View style={styles.tradeCheckButtonView}>
            <Image style={styles.tradeCheckButtonIcon} source={renderIcon} />
            <Text style={styles.tradeCheckButtonText}>
              关注
            </Text>
          </View>
        </TouchableHighlight>;
    }
    var styleString = styles.tradeCheck;
    if(this.props.positionType == "first"){
      styleString = styles.firstTradeCheck;
    }
    if(this.props.positionType == "last"){
      styleString = styles.lastTradeCheck;
    }

    return(
      <View style={styleString}>
        <Text style={styles.tradeCheckText}>{this.props.trade.name}</Text>
        {rightButton}
      </View>
    )
  }
}
var styles = StyleSheet.create({
  tradeCheck: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  firstTradeCheck: {
    flex: 1,
    height: 34,
    paddingTop: 1,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',    
  },
  lastTradeCheck: {
    flex: 1,
    height: 34,
    paddingBottom: 1,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',    
  },
  tradeCheckText: {
    flex: 1,
    fontSize: 16,
    color: '#404040',
    justifyContent: 'flex-start',
  },
  tradeCheckButton: {
    justifyContent: 'flex-end',
  },
  tradeCheckButtonView: {
    height: 20,
    width: 50,
    borderRadius: 2,
    backgroundColor: '#8FC1CF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeCheckButtonText: {
    color: '#24AE95',
    fontSize: 13,
  },
  tradeUnCheckButtonView: {
    height: 20,
    width: 50,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderStyle: null,
    borderWidth: 0.5,
    justifyContent: 'center',
  },
  tradeUnCheckButtonText: {
    color: '#C0C0C0',
    fontSize: 12,
  },
  tradeCheckButtonIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',

  },
  tradeCheckButtonText: {
    fontSize: 12,
    color: 'white',
  },
})