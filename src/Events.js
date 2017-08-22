import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  SegmentedControlIOS,
  Button,
  Text
} from 'react-native';


import _ from 'lodash';
import EventPoster from './EventPoster';
import EventPopup from './EventPopup';

import { defaultStyles } from './styles';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';



@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    refresh: () => dispatch({type: 'GET_EVENT_DATA'}),
  }),
)
export default class Events extends Component {
  
  state = {
    popupIsOpen: false,
    selectedIndex: 1
  }

  openEvent = (event) => {
    this.setState({
      popupIsOpen: true,
      event,	
    });
  }
  
  closeEvent = () => {
    this.setState({
      popupIsOpen: false,
      // Reset values to default ones
      chosenDay: 0,
      chosenTime: null,
    });
  }

  bookEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Confirmation', {
      event: this.state.event,
      participant: this.props.navigation.state.params.person
    }); 
  }

  joinEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Join', {
      event: this.state.event,
      person: this.props.navigation.state.params.person
    }); 
  }

  manageEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Manage', {
      event: this.state.event,
      person: this.props.navigation.state.params.person
    }); 
  }

  manageEventRequest = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('ManagePermission', {
      event: this.state.event,
      person: this.props.navigation.state.params.person
    }); 
  }

  render() {
    const { events, loading, refresh } = this.props;
    const { person } =  this.props.navigation.state.params;

    return (
      <View style={styles.container}>
      
        <View style={styles.navBar}>
          {/* <Text style={styles.navBarButton}
            onPress={() =>  this.props.navigation.navigate('Profile', {
              user: person
            })}>
             Profile
          </Text> */}

          <Icon style={styles.navBarButton}
            onPress={() =>  this.props.navigation.navigate('Profile', {
              user: person
            })} name="ios-person-outline" size={30} color="#900" />
          {/* 
          this.props.navigation.goBack()} 
             */}
          <Text style={styles.navBarHeader}>Мероприятия</Text>

          {/* <Icon style={styles.navBarHeader} name="ios-calendar" size={30} color="#900" /> */}
         
          <Icon style={styles.navBarButton}
            onPress={() => this.props.navigation.navigate('Mymatches', {
              person: person
            })} name="ios-chatboxes-outline" size={30} color="#900" /> 
          {/* <Text style={styles.navBarButton}
            onPress={() => this.props.navigation.navigate('Mymatches', {
              person: person
            })}>
             Matches
          </Text> */}
        </View>
  
        <SegmentedControlIOS tintColor="#3f88fb" style={styles.bottomContent} 
          values={['Мои', 'Найти']}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        />
       
        {events // and movies participants contains data && this.state.selectedIndex == 1
          ? <ScrollView
              contentContainerStyle={styles.scrollContent}
              // Hide all scroll indicators
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                />
              }
            >
              {events.map((event, index) => {
                if (this.state.selectedIndex == 0) {
                  if (event.participant_ids.includes(person._id) || event.manage_ids.includes(person._id)) { //(  typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(person._id) > -1 ) { 
                    return <EventPoster
                      event={event}
                      person={person}
                      onOpen={this.openEvent}
                      key={index}
                    /> 
                  }  
                } else {
                  return <EventPoster
                    event={event}
                    person={person}
                    onOpen={this.openEvent}
                    key={index}
                  /> 
                }
              }

              )}
            </ScrollView>
          : <ActivityIndicator
              animating={loading}
              style={styles.loader}
              size="large"
            />
        }

        

        <EventPopup
          event={this.state.event}
          person={person}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeEvent}
          onBook={this.bookEvent}
          onJoin={this.joinEvent}
          onManage={this.manageEvent}
          onManageRequest={this.manageEventRequest}
        />
      </View>
      
    );
  }

}

const styles = StyleSheet.create({
  // header styles
  gradient: {
    width: 400,
    height: 200,
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64
    // backgroundColor: '#FFFFFF' //'#1EAAF1'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 15,
    // marginTop: 5
  },
  container: {
    flex: 1,                // take up all screen
    //paddingTop: 20,         // start below status bar
    backgroundColor: '#FFFFFF'
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  scrollContent: {
    paddingTop: 10, 
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
  },

  bottomContent: {
    // margin: 30,
    // borderTopColor: '#262626',
    // borderRadius: 1,
    marginTop: 5, 
    marginRight: 10,
    marginLeft: 10
  }
});