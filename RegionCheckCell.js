import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

export default class RegionCheckCell extends Component {
  constructor(props) {
    super(props);

  }

  setSelectState(isSelect) {
    this.props.region.isSelect = isSelect;
  }

  onPressRegionSelect() {
    var isSelect = this.props.region.isSelect;
    this.props.onRegionSelect(this.props.arrayNum, !isSelect);
    this.setSelectState(!isSelect);
  }

  render() {
    if(this.props.region.isSelect){
      var checkButton = 
        <TouchableHighlight style={styles.regionCheckButton} onPress={()=>this.onPressRegionSelect()}  underlayColor='transparent'>
          <Text style={styles.regionCheckButtonText}>
            {this.props.region.name}
          </Text>
        </TouchableHighlight>;
    }else{
      var checkButton =
      <TouchableHighlight style={styles.regionUnCheckButton} onPress={()=>this.onPressRegionSelect()}  underlayColor='transparent'>
        <View style={styles.regionUnCheckButtonView}>
          <Text style={styles.regionUnCheckButtonText}>
            {this.props.region.name}
          </Text>
        </View>
      </TouchableHighlight>;

    }
    return(
      <View style={styles.regionCheck}>
        {checkButton}
      </View>
    )
  }
}
var styles = StyleSheet.create({
  regionCheck: {
    flex: 1,
    flexDirection: 'row',
    marginLeft:8,
    marginRight:8,
    marginTop:9,
    marginBottom:9,
  },
  regionCheckButton: {
    flex: 1,
    height:26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: '#8FC1CF',
  },
  regionUnCheckButton: {
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
  regionCheckButtonText: {
    fontSize: 15,
    alignItems: 'center',
    color: 'white',
  },
  regionUnCheckButtonText: {
    fontSize: 15,
    alignItems: 'center',
    color: '#606060',

  }
})