import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';


import { defaultStyles } from '../../../styles';

const { width, height } = Dimensions.get('window');
const cols = 3, rows = 4;
const placesHeight = (height - 20 - 20) / rows - 10;

export default class Date extends Component {
  render() {
    const { value } = this.props;
    return  <View
        underlayColor="#9575CD"
        style={styles.buttonContainer}
      >
      <Text style={styles.places}>{value}</Text>
    </View> 
  }
}

const styles = StyleSheet.create({
  iconic: {
    // marginLeft: 5,
    // marginTop: 7,
  },
  places: {
    ...defaultStyles.text,
    fontSize: 12,
    fontWeight: 'bold',
    // marginTop: placesHeight,
    // marginLeft: 15,
    // marginTop: 7,
    color: '#3f88fb',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonContainer: {
    marginTop: placesHeight / 4, //30,   //////// fix
    marginLeft: 15,
    // height: 30,
    width: 90,
    alignItems: 'center',
    // flexDirection: 'row',
    backgroundColor: '#FFF', // 3f88fb
    borderRadius: 8,
    // marginRight: 15
    // marginLeft: 200,
    // paddingVertical: 10,
    // paddingHorizontal: 30,
  },
});

