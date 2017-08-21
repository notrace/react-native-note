/**
 * 全局样式
 * @flow
 */
import {
  Dimensions,
} from 'react-native'

const {height, width} = Dimensions.get('window');

module.exports ={
  line: {
    flex: 1,
    height: 0.4,
    opacity:0.5,
    backgroundColor: 'darkgray',
  },
  cell_container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width:0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation:2
  },
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
  listView_container:{
    flex: 1,
    backgroundColor: '#f3f3f4',
  },
  bottomLine:{
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  settingGroupContain: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
    marginTop: 15,
    backgroundColor: 'white',
  },
  titleStyle:{
    fontSize: 17,
    color: '#909090',
  },
  textField: {
    height:45,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    textAlign: 'left',
    textAlignVertical:'center',
    color:"#606060",
  },
  bottomLine:{
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  backgroundColor: '#f3f3f4',
  listView_height:(height-(20+40)),
  window_height:height,
  window_width:width,
  nav_bar_height_ios:44,
  nav_bar_height_android:50,
};