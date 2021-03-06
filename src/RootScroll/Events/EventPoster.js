import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


import Places from './widgets/Places';
import Sticker from './widgets/Sticker';
import Cost from './widgets/Cost';
import Date from './widgets/Date';
import { defaultStyles } from '../../styles';



// Get screen dimensions
const { width, height } = Dimensions.get('window');
// How many posters we want to have in each row and column
const cols = 3, rows = 4;

const placesHeight = (height - 20 - 20) / rows - 10;

// connect 1 param - events

import { connect } from 'react-redux';

@connect(
  state => ({
    current_user: state.current_user
  }),
  dispatch => ({}),
)
export default class EventPoster extends Component {
  // Component prop types
  static propTypes = {
    // Movie object with title, genre, and poster
    event: PropTypes.object.isRequired, // comment it
    // person: PropTypes.object.isRequired,
    // Called when user taps on a poster
    onOpen: PropTypes.func.isRequired,
  }
  render() {
    var { current_user, event, current_user: { gender }, onOpen, event } = this.props;

    if (gender == 1) {
      var cost = event.cost_women;
    } else if (gender == 2) {
      var cost = event.cost_men;
    }
    var left_places = event.places_max - event.participant_ids.length;
    if (event.participant_ids.includes(current_user._id)) {
      var part = true;
    } else {
      var part = false;
    }

    if (event.manage_ids.length > 0 && typeof (event.manage_ids[0]) == 'object') {
      var manage_ids = event.manage_ids.map(event => event._id);
    } else {
      var manage_ids = event.manage_ids;
    }

    if (manage_ids.includes(current_user._id)) {
      var manage_approve = true;

    } else {
      var manage_approve = false;
    }

    return (
      <TouchableOpacity style={styles.container} onPress={() => onOpen(event)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.photo }} style={styles.image} />
          <View style={styles.overlay} />
          {/* <LinearGradient  start={{x: 0.0, y: 0.1}} end={{x: 1.0, y: 0.6}}
              locations={[0,0.3,0.7]}
                colors={[ 'rgba(63, 136, 251, 0.8)', 'rgba(85, 149, 252, 0.8)', 'rgba(79, 69, 100, 0.8)']}
                  style={styles.overlay} /> */}

          <View style={styles.upPoster}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
            <Sticker value={event.show_manage} />
          </View>
          <Date style={styles.date} value={'11.09.2017'} />
          {/* {date}   18-00*/}

          <View style={styles.downPoster}>
            <Places now={left_places} max={event.places_max} />
            <Cost cost={cost} part={part} manage={manage_approve} />
          </View>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  upPoster: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  downPoster: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: placesHeight - (10 + placesHeight / 2 + 10 + 33),

  },
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: placesHeight,
    width: (width - 20) /// cols - 10,
  },
  // WIDGETS
  title: {
    ...defaultStyles.text,
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10,
    marginLeft: 15,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  // date: {
  //   ...defaultStyles.text,
  //   fontSize: 14,
  //   // fontWeight: 'bold',
  //   // marginTop: (height - 20 - 20) / rows - 130,
  //   marginLeft: 15,
  //   color: '#FFFFFF',
  //   backgroundColor: 'rgba(0,0,0,0)',
  // },

  // genre: {
  //   ...defaultStyles.text,
  //   color: '#BBBBBB',
  //   fontSize: 12,
  //   lineHeight: 14,
  // },
  imageContainer: {
    flex: 1,                          // take up all available space
  },
  image: {
    borderRadius: 5,                 // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  overlay: {
    borderRadius: 5,
    ...StyleSheet.absoluteFillObject, // 
    backgroundColor: 'rgba(79, 69, 100, 0.8)'//rgba(63, 136, 251, 0.6)' // 63, 136, 251, 1
  }
});