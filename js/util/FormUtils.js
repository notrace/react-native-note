
import React  from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import GlobalStyles from '../util/GlobalStyles.js'

export default class FormUtils {
  static textField(tagName, placeholder, callback, optionStyle){
    return(
      <View style={[styles.textFormGroup, optionStyle]}>
        <View style={styles.formLabel}>
          <Text style={styles.labelText}>{tagName}</Text>
        </View>
        <TextInput 
          style={styles.textTextField}
          placeholder={placeholder}
          placeholderTextColor="#C0C0C0"
          underlineColorAndroid="transparent"
          numberOfLines={1}
          multiline={false}
          secureTextEntry={true}
          onChangeText={(text) => {callback(text)}}/>
      </View>  
    ) 
  }
}
var styles = StyleSheet.create({

  textFormGroup:{
    marginLeft:15,
    flexDirection:'row',
    height:46,
    alignItems:'center'
  },
  formLabel: {
    width: 90,
    alignItems: "flex-start",
    justifyContent: 'center',
  },
  labelText:{
    fontSize: 17,
    color:"#606060",
    textAlign:'justify',
  },
  textTextField:{
    paddingTop: 2,
    fontSize: 17,
    textAlign: 'left',
    flex: 1,
    color:"#606060",
  },
})