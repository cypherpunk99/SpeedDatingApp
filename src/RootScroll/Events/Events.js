import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Button,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Icon from 'react-native-vector-icons/Ionicons';



import EventPopup from './EventPopup';
import { defaultStyles } from '../../styles';
import ScrollViewElements from './ScrollViewElements';



const { width, height } = Dimensions.get('window');
const heightFinal = Platform.OS == 'ios' ? height - 70 : height - 90;

import { fetchEvents } from '../../helpers/actions';
import { connect } from 'react-redux';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
    current_user: state.current_user
  }),
  dispatch => ({
    refresh: () => dispatch(fetchEvents()),
  }),
)
export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupIsOpen: false,
      selectedIndex: 1,
      chosenTable: null
    };
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
      participant: this.props.current_user
    });
  }
  joinEvent = () => {
    if (this.state.chosenTable == null) {
      alert('Please select table');
    } else {
      this.closeEvent();
      const { navigate } = this.props.navigation;
      this.props.current_user.table = this.state.chosenTable + 1; 
      navigate('Join', {
        event: this.state.event,
      });
    }
  }
  manageEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Manage', {
      event: this.state.event
    });
  }
  manageEventRequest = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('ManagePermission', {
      event: this.state.event
    });
  }
  chooseTable = (table) => {
    this.setState({
      chosenTable: table,
    });
  }
  componentWillMount() {
    this.props.refresh(); // fix!
  }
  render() {
    const { events, loading, refresh } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.bottomContent}>
          <SegmentedControlTab
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            values={['Мои', 'Найти']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={(index) => {
              this.setState({ selectedIndex: index });
            }}
          />
        </View>
        {events
          ?
          <ScrollViewElements
            selected={this.state.selectedIndex}
            onOpenEvent={this.openEvent}
          />
          : <ActivityIndicator
            animating={loading}
            style={styles.loader}
            size="large"
          />
        }
        <EventPopup
          event={this.state.event}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeEvent}
          onBook={this.bookEvent}
          onJoin={this.joinEvent}
          onManage={this.manageEvent}
          onManageRequest={this.manageEventRequest}
          chosenTable={this.state.chosenTable}
          onChooseTable={this.chooseTable}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: heightFinal
  },
  bottomContent: {
    marginTop: 5,
    marginRight: 10,
    marginLeft: 10
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  tabStyle: {
    borderColor: '#3f88fb',
  },
  activeTabStyle: {
    backgroundColor: '#3f88fb'
  },
  tabTextStyle: {
    color: '#3f88fb'
  },
  gradient: {
    width: 400,
    height: 200,
  }
});