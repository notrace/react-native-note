import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

export default class FinanceStageCheckCell extends Component {
  constructor(props) {
    super(props);

  }

  setSelectState(isSelect) {
    this.props.financeStage.isSelect = isSelect;
  }

  onPressFinanceStageSelect() {
    var isSelect = this.props.financeStage.isSelect;
    this.props.onFinanceStageSelect(this.props.arrayNum, !isSelect);
    this.setSelectState(!isSelect);
  }

  render() {
    if(this.props.financeStage.isSelect){
      var checkButton = 
        <TouchableHighlight style={styles.financeStageCheckButton} onPress={()=>this.onPressFinanceStageSelect()}  underlayColor='transparent'>
          <Text style={styles.financeStageCheckButtonText}>
            {this.props.financeStage.name}
          </Text>
        </TouchableHighlight>;
    }else{
      var checkButton =
      <TouchableHighlight style={styles.financeStageUnCheckButton} onPress={()=>this.onPressFinanceStageSelect()}  underlayColor='transparent'>
        <View style={styles.financeStageUnCheckButtonView}>
          <Text style={styles.financeStageUnCheckButtonText}>
            {this.props.financeStage.name}
          </Text>
        </View>
      </TouchableHighlight>;

    }
    return(
      <View style={styles.financeStageCheck}>
        {checkButton}
      </View>
    )
  }
}
var styles = StyleSheet.create({
  financeStageCheck: {
    flex: 1,
    flexDirection: 'row',
    marginLeft:8,
    marginRight:8,
    marginTop:9,
    marginBottom:9,
  },
  financeStageCheckButton: {
    flex: 1,
    height:26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: '#8FC1CF',
  },
  financeStageUnCheckButton: {
    flex: 1,
    height:26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#909090',
    borderStyle: null,
    borderWidth: 0.5, 
    borderRadius: 2,
  },
  financeStageCheckButtonText: {
    fontSize: 15,
    alignItems: 'center',
    color: 'white',
  },
  financeStageUnCheckButtonText: {
    fontSize: 15,
    alignItems: 'center',
    color: '#606060',

  }
})