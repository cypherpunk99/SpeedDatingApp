import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../styles';

const { width, height } = Dimensions.get('window')


import { connect } from 'react-redux';
import { updateUser } from '../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
    current_user: state.current_user
  }),
  dispatch => ({
    update_user: (user) => dispatch(updateUser(user)), 
  }),
)
export default class UniversityModal extends Component {
  constructor(props) {
    super(props);
    const { current_user } = this.props; 
    this.state = {
      current_university: current_user.current_university ? current_user.current_university : '',
      university: current_user.university
    }
  }
    
  saveUser = async () => {
    const { current_user } = this.props;
    current_user.current_university = this.state.current_university;
    try {
      this.props.update_user(current_user);
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    const { goBack } = this.props.navigation;
    const { current_user } = this.props;
    
    return (
      
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Университет</Text>
          <TouchableOpacity onPress={() =>  {
            this.saveUser();
            this.props.navigation.navigate('Edit'); // , { user: user }
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
       
        <ScrollView
          contentContainerStyle={styles.scrollContent}>
          

          <View style={styles.back}>
          <TouchableOpacity onPress={() =>  {
            this.setState({ 
              current_university: current_user.university
            })
          }}>

          {/* for each from user.university */}
          <View style={styles.navBarTest}>
            <Text style={styles.item}>{current_user.university.education_type } at {current_user.university.school_name} </Text>
            <Icon style={ this.state.current_university != '' ? styles.colorfull : styles.transparent } name="ios-checkmark" size={35} />
          </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() =>  {
            this.setState({ 
              current_university: ''
            })
          }}>
          <View style={styles.navBarTest}>
            <Text style={styles.item}>Нет</Text>
            <Icon  style={ this.state.current_university == '' ? styles.colorfull : styles.transparent } name="ios-checkmark" size={35} />
          </View>
          </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    );
  }
}
    
const styles = StyleSheet.create({
  back: {
    marginTop: 30,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
  },
  transparent: {
    color: 'transparent'
  },
  colorfull: {
    color: '#3f88fb'
  },
  navBarTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  

  navBarButton: {
    color: '#3f88fb',
    textAlign:'center',
    width: 80,
    fontSize: 18,
    fontWeight: 'bold'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 18,
    // marginTop: 5
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },

  sectionHeader: {
    // paddingTop: 2,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 2,
    // fontSize: 14,
    // fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontFamily: 'System',
    textAlign:'center',
  },

});