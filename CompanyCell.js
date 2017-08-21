/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  RefreshControl,
  TouchableOpacity,
  ListView,
  View
} from 'react-native';
import ProjectItem from './ProjectItem';

export default class CompanyCell extends Component {
  constructor(props) {
    super(props);
  }

  _clickToWebView(id, url) {
    const {navigator} = this.props;
    if(navigator) {
      navigator.push({
        index: 1,
        component: ProjectItem,
        title: 'Home',
        params: {
          id: id,
          url: url,
          company: this.props.shishen,
        }
      })
    }
  }

  render() {
    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity onPress={()=>this._clickToWebView(this.props.shishen.id,this.props.shishen.show_url)}>
          <View style={styles.projectHead}>
            <Image 
              source={{uri: this.props.shishen.logo}}
              style={styles.thumbnail} />
            <View style={styles.projectCellHeadRight}>
              <Text style={styles.title}>{this.props.shishen.name}</Text>
              <Text style={styles.desc}>{this.props.shishen.desc}</Text>
            </View>
          </View>
          
          <View style={styles.projectCellTwo}>
            <View style={styles.projecCellItem}>
              <Image
                source={require('./res/images/icon/locationIcon.png')} 
                style={styles.projectCellTwoIcon} />
              <Text style={styles.projectCellTwoText}>{this.props.shishen.city}</Text>
            </View>
            <View style={styles.projecCellItem}>
              <Image
                source={require('./res/images/icon/team_scope.png')} 
                style={styles.projectCellTwoIcon} />
              <Text style={styles.projectCellTwoText}>{this.props.shishen.team_scope}</Text>
            </View>
            <View style={styles.projecCellItem}>
              <Image
                source={require('./res/images/icon/born_date.png')} 
                style={styles.projectCellTwoIcon} />
              <Text style={styles.projectCellTwoText}>{'成立' + this.props.shishen.born_date_text}</Text>
            </View>
          </View>
          <View style={styles.projectCellThree}>
            <View style={styles.projectCellThreeInvestmentName}>
              <Text style={styles.projectCellName}>
                {this.props.shishen.investment_name}
              </Text>
            </View>
            <Text style={styles.projectCellThreeInvestmentMoney}>
              {'融资额度:' + this.props.shishen.investment_money}
            </Text>
          </View>
          <View style={styles.projectCellFoot}>
            <View style={styles.projectCellFootItem}>
              <Text style={styles.projectCellTradeTagText}>{'#' + this.props.shishen.trade_tag}</Text>
            </View>
            <View style={styles.projectCellFootItem}>
              <Image
                source={require('./res/images/icon/fav.png')} 
                style={styles.projectCellFavIcon} />
              <Text style={styles.projectCellFavText}>{this.props.shishen.fav_text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  cellContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    elevation:2
  },
  projectHead: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 4,
    paddingLeft:0,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'contain',
  },
  projectCellHeadRight: {
    flex: 1,
    paddingLeft: 15,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  projectCellTwo: {
    paddingLeft: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projecCellItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectCellTwoIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  projectCellTwoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#909090',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: '#303030',
  },
  desc: {
    fontSize: 14,
    color: '#606060',
  },
  year: {
    textAlign: 'center',
  },
  projectCellThree: {
    marginTop: 12,
    paddingLeft: 0,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  projectCellThreeInvestmentName: {
    backgroundColor: '#8FC1CF',
    borderRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  projectCellName: {
    color: 'white',
    fontSize: 14,
  },
  projectCellThreeInvestmentMoney: {
    color: '#303030',
    marginLeft: 8,
  },
  projectCellFoot: {
    marginTop: 12,
    paddingLeft: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectCellFootItem: {
    flexDirection: 'row',
  },
  projectCellTradeTagText:{
    color: '#909090',
    fontSize: 14,
  },
  projectCellFavIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  projectCellFavText: {
    marginLeft: 8,
    color: '#909090',
    fontSize: 14,
  },
});
