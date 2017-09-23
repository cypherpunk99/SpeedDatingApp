import React, { Component, PropTypes } from 'react';
import {
  Linking,
  StyleSheet,
  Platform,
  Text,
  View,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafariView from 'react-native-safari-view';


import Screens from './Screens';
import { onSignIn } from "../helpers/auth";
import { ResetToSignedIn } from "../helpers/router";


const { width, height } = Dimensions.get('window');

const URL = Platform.OS === 'android'
? 'http://192.168.1.33:3000' // works for Genymotion
: 'http://192.168.1.33:3000';


export default class Login extends Component { 
  
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    // Decode the user string and parse it into JSON
    const user = JSON.parse(decodeURI(user_string));
    // Call onLoggedIn function of parent component and pass user object
    // !

    onSignIn(user).then(() => this.props.navigation.dispatch(ResetToSignedIn)) // this.props.onLoggedIn(user); 
    
    
    // const { navigate } = this.props.navigation;
    // navigate('ScrollTab'); //'Profile', { user: user }); // change to ScrollableTabView 
    // change to state ? login : ScrollTab 
    // like here: http://rationalappdev.com/implementing-comments-with-react-native-and-nodejs/




    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL(`${URL}/auth/facebook`);

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL(`${URL}/auth/google`);

  // Handle Login with Vk button tap
  loginWithVk = () => this.openURL(`${URL}/auth/vkontakte`);
  
  // Open URL in a browser
  openURL = (url) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Screens />
        {/* <View style={styles.content}>
          <Text style={styles.header}>
            Welcome Stranger!
          </Text>
          <View style={styles.avatar}>
            <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
          </View>
          <Text style={styles.text}>
            Please log in to continue {'\n'}
            to the awesomness
          </Text>
        </View> */}


        <View style={styles.contentNew}>

        <View style={styles.buttons}>
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={this.loginWithFacebook}
            {...iconStyles}
          >
           
            <Text style={styles.buttonText}>ВОЙТИ ЧЕРЕЗ FACEBOOK</Text> 
          </Icon.Button>
           
          <Icon.Button
            name="vk"
            backgroundColor="#45668e"
            onPress={this.loginWithVk}
            {...iconStyles}
          >
          <Text style={styles.buttonText}>ВОЙТИ ЧЕРЕЗ VK</Text> 
          </Icon.Button>
          </View>

        </View>

      </View>
    );
  }
}


const iconStyles = {
  borderRadius: 30,
  iconStyle: { paddingVertical: 10 },
  
  // marginLeft: 40
  // alignItems: 'center',
};

 


const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'System', 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  contentNew: {
    height: 210,
    width: width
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 30,
    marginRight: 30,
  },
   
});