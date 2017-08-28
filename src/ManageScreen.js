import React, { Component } from 'react';
import _ from 'lodash';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View, 
  ListView, 
  ScrollView,
  TextInput,
  Button,
  RefreshControl
} from 'react-native';
import { defaultStyles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';

import IntervalPopup from './IntervalPopup';


export default class ManageScreen extends Component {
  //   --main ws--
  // [ ManageScreen -> 'start' -> VotingStatusScreen ] -> 'done' ->  MatchScreen

 
  state = {
    selected: [],
    participants: [], // init on open - get queue from server
    index: 0,
    popupIsOpen: false,
    test: ''
  };
 
  openInterval = () => {
    this.setState({
      popupIsOpen: true,
    });
  }
  
  closeInterval = () => {
    this.setState({
      popupIsOpen: false,
    });
  }

  closeChoose = (test) => {
    this.setState({
      test: test
    }) 
  }
  
     
    

  onOpenConnection = () => {
    console.log(' - onopen - ');
    // get participants from server queue and clean it
    // send clients_queue ws req
    let json = JSON.stringify({
      command: "clients_queue"
    });
    this.ws.send(json);
  }

  onMessageRecieved = (e) => {

    console.log(e.data);
    var obj = JSON.parse(e.data); 
    
    if (obj.type == 'response_queue') {
      console.log('response_queue', '--------------------->', obj.data)
      obj.data.map( (partic)=> {
        this.state.participants.push(partic);
      })
      this.setState({
        participants: this.state.participants
      })
    }

    // change to listen each on websocket , not all together
    if (obj.type == 'connected') {
      // var participant = JSON.parse(obj.data);
      this.state.participants.push(obj.data);
      this.setState({
        participants: this.state.participants
      })
    }
    if (obj.type == 'closed') {

      console.log('----------CLOSED---------------!!!!!!');
      // var participant = JSON.parse(obj.data);
      for (var i = 0; i < this.state.participants.length; i++) {
        if (this.state.participants[i]._id == obj.data._id) {
          this.state.participants.splice(i, 1); 
          break;
        }
      }
      this.setState({
        participants: this.state.participants
      })
    }

    if (obj.type == 'selected') {
      var selected_data = JSON.parse(obj.data);
      this.setState({
        selected: selected_data
      })

      const { navigate } = this.props.navigation;
      navigate('VotingStatus', {
        participants: this.state.selected,
        person: this.props.navigation.state.params.person,
        event: this.props.navigation.state.params.event
      });    
    }
  };

  onError = (e) => {
    console.log(e.message);
  };

  onClose = (e) => {
    console.log(e.code, e.reason);
  };

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onopen = this.onOpenConnection;
    this.ws.onmessage = this.onMessageRecieved;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  start = () => {
    const { event } = this.props.navigation.state.params;
    if (this.state.selected.length > 0) {
      let json = JSON.stringify({
        command: "start",
        timeout: 2,
        talk_time: parseInt(this.state.talk_time),
        selected: JSON.stringify(this.state.selected),
        event: JSON.stringify(event)
      });
      this.ws.send(json);
    } else {
      alert('Select participants to start')
    }
  }

  onSelected = (participant) => {
    if(!_.includes(this.state.selected, participant)) {
      this.state.selected.push(participant)
      // add color
    } else {
      _.remove(this.state.selected, participant);
      // remove color
    }
  }

  render() {
    
    const { event } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        
        
        <View style={styles.navBar}>
          <Icon style={styles.navBarButtonIcon} onPress={() => this.props.navigation.goBack() } name="ios-arrow-back" size={25} color="#900"  />
          <Text style={ [styles.navBarButton,{
            fontWeight: 'bold'
          }]} onPress={() => this.props.navigation.goBack() }>Назад к мероприятиям</Text>
          <Text style={styles.navBarHeader}></Text>
          <Text style={styles.navBarButton}>  </Text> 
        </View>
         
        <TouchableOpacity onPress={this.openInterval}>
          <Text> Click to choose interval: </Text>
        </TouchableOpacity>
        <Text> {this.state.test} </Text>
        
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {this.state.participants.map((participant, index) => <Participant participant={participant} key={index}  onSelected={this.onSelected}/>)}
        </ScrollView>


        
        <TouchableHighlight
            underlayColor="#9575CD"
            style={styles.buttonContainer}
            onPress={this.start}
            >
            <Text style={styles.button}>Начать мероприятие</Text>
        </TouchableHighlight> 

        <IntervalPopup 
          isOpen={this.state.popupIsOpen} 
          onClose={this.closeInterval}
          onChoose={this.closeChoose}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "#FFF"
  },
  //////
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 200,
    color: '#3f88fb'
  },
  navBarButtonIcon: {
    marginTop: -4,
    color: '#262626',
    textAlign:'center',
    marginLeft: 10,
    // width: 200,
    color: '#3f88fb'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 15,
    // marginTop: 7
  },
  //////
  header: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 20,
  },
  code: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 36,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#673AB7',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});
