import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import ActiveMerit from '../../components/ActiveMerit/ActiveMerit';
import PledgeMerit from '../../components/PledgeMerit/PledgeMerit';
import Settings from '../../components/Settings/Settings';
const firebase = window.firebase;

const tabContainerStyle = {
  position: 'fixed',
  top: 50,
  zIndex: 1
};

const swipeableViewStyle = {
  height: 'calc(100vh - 100px)',
  backgroundColor: '#fafafa',
  marginTop: '100px'
};

function MeritBook(props) {
  const isActive = props.active;

  if (isActive) {
    return <ActiveMerit userArray={props.userArray} />;
  }
  else {
    return <PledgeMerit />;
  }
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      active: false,
      loaded: false,
      userArray: [],
    };
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;
    let dbRef = firebase.database().ref('/users/');
    let userRef = firebase.database().ref('/users/' + user.displayName);
    let userStatus;
    let userArray = [];

    dbRef.on('value', (snapshot) => {
      userArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key]
      });
      userArray = userArray.filter(function(user) {
        return user.status === 'pledge';
      })

      this.setState({
        userArray: userArray
      })
    });

    userRef.on('value', (snapshot) => {
      userStatus = snapshot.val().status;

      if (userStatus === 'active') {
        this.setState({
          active:true,
          loaded:true
        })
      }
    });
  }

  handleChange = (value) => {
    let title;

    if (value === 0) {
      title = 'Merit Book';
    }
    else if (value === 1) {
      title = 'Chalkboards';
    }
    else {
      title = 'Settings';
    }

    this.setState({
      title: title,
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <div className="app-header">
          {this.state.title}
        </div>
        <Tabs
          tabItemContainerStyle={tabContainerStyle}
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab 
            icon={<i className="icon-address-book"></i>}
            value={0}
          />
          <Tab
            icon={<i className="icon-calendar-empty"></i>}
            value={1}
          />
          <Tab
            icon={<i className="icon-sliders"></i>}
            value={2} 
          />
        </Tabs>
        <SwipeableViews
          style={swipeableViewStyle}
          animateHeight={true}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          {this.state.loaded ? 
            <MeritBook active={this.state.active} userArray={this.state.userArray} /> : 
            <div></div>
          }
          <div> Chalkboards </div>
          <Settings />
        </SwipeableViews>
      </div>
    )
  }
}