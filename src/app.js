import React, { Component } from 'react'; 
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import PushNotification from 'react-native-push-notification';

import { createRootNavigator } from "./helpers/router";
import { isSignedIn } from "./helpers/auth";


import { WS_URL } from "./helpers/constants";


import { Provider } from 'react-redux';
import configureStore from './helpers/store';

let state = { 
  events: [], 
  loading: true, 
  participants: [],
  selected: []
}; // preloadedState - when init from background
const store = configureStore(state)

const action = () => {
  return {
    type: 'WEBSOCKET:CONNECT',
    url: WS_URL 
  }
}

store.dispatch(action());


// AsyncStorage.clear(); 

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    PushNotification.configure({
        onRegister: function(token) {
            console.log( 'TOKEN:', token );
        },
        onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification );
        },
    });
  }

  componentWillMount() {
    isSignedIn()
      .then(res => {
        return this.setState({ signedIn: res, checkedSignIn: true })
      })
      .catch(err => alert("An error occurred: " + JSON.stringify(err)));
  }
  render() {
    const { checkedSignIn, signedIn } = this.state;
    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    // create store here
    const Layout = createRootNavigator(signedIn); 
    return (
      <Provider store={store}> 
        <Layout />
      </Provider>
    );
  }
}



