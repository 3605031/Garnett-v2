import './PledgeApp.css';
import '../../fontello/css/fontello.css';
// import API from '../../api/API.js';
import {getTabStyle} from '../../helpers/functions.js';
import {LoadingPledgeApp, LoadingComponent} from '../../helpers/loaders.js';

import React, {Component} from 'react';
import Loadable from 'react-loadable';
import {Tabs, Tab} from 'material-ui/Tabs';

let didScroll = false;
let previousScrollTop = 0;

function watchScroll() {
  didScroll = true;
}

const LoadableMeritBook = Loadable({
  loader: () => import('../../components/MeritBook/MeritBook'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

const LoadableContacts = Loadable({
  loader: () => import('../../components/Contacts/Contacts'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

const LoadableChalkboards = Loadable({
  loader: () => import('../../components/Chalkboards/Chalkboards'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

const LoadableComplaints = Loadable({
  loader: () => import('../../components/Complaints/Complaints'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

const LoadableSettings = Loadable({
  loader: () => import('../../components/Settings/Settings'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading: LoadingComponent
});

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      previousIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      scrollPosition3: 0,
      scrollPosition4: 0,
      scrollPosition5: 0,
      loaded: false,
      activeArray: [],
      pledgeArray: [],
      meritArray: [],
      pledgeComplaints: [],
      activeComplaints: [],
      pendingComplaints: [],
      approvedComplaints: [],
      myHostingChalkboards: [],
      myAttendingChalkboards: [],
      myCompletedChalkboards: [],
      upcomingChalkboards: [],
      completedChalkboards: []
    };
  }

  componentWillMount() {
    console.log('Pledge app mount: ', this.props.state.name)

    let data = JSON.parse(localStorage.getItem('data'));

    localStorage.setItem('route', 'pledge-app');

    if (navigator.onLine) {
      this.setState({
        loaded: true
      });
    }
    else {
      let activeArray = JSON.parse(localStorage.getItem('activeArray'));
      let myAttendingChalkboards = JSON.parse(localStorage.getItem('myAttendingChalkboards'));
      let myCompletedChalkboards = JSON.parse(localStorage.getItem('myCompletedChalkboards'));
      let upcomingChalkboards = JSON.parse(localStorage.getItem('upcomingChalkboards'));
      let completedChalkboards = JSON.parse(localStorage.getItem('completedChalkboards'));

      if (data.status !== 'pledge') {
        let pledgeArray = JSON.parse(localStorage.getItem('pledgeArray'));
        let myHostingChalkboards = JSON.parse(localStorage.getItem('myHostingChalkboards'));
        let activeComplaints = JSON.parse(localStorage.getItem('activeComplaints'));
        let pendingComplaints = JSON.parse(localStorage.getItem('pendingComplaints'));
        let approvedComplaints = JSON.parse(localStorage.getItem('approvedComplaints'));

        this.setState({
          loaded: true,
          pledgeArray: pledgeArray,
          activeArray: activeArray,
          activeComplaints: activeComplaints,
          pendingComplaints: pendingComplaints,
          approvedComplaints: approvedComplaints,
          myHostingChalkboards: myHostingChalkboards,
          myAttendingChalkboards: myAttendingChalkboards,
          myCompletedChalkboards: myCompletedChalkboards,
          upcomingChalkboards: upcomingChalkboards,
          completedChalkboards: completedChalkboards
        });
      }
      else {
        let meritArray = JSON.parse(localStorage.getItem('meritArray'));
        let pledgeComplaints = JSON.parse(localStorage.getItem('pledgeComplaints'));
        let totalMerits = localStorage.getItem('totalMerits');

        this.setState({
          loaded: true,
          meritArray: meritArray,
          totalMerits: totalMerits,
          pledgeComplaints: pledgeComplaints,
          activeArray: activeArray,
          myAttendingChalkboards: myAttendingChalkboards,
          myCompletedChalkboards: myCompletedChalkboards,
          upcomingChalkboards: upcomingChalkboards,
          completedChalkboards: completedChalkboards
        });
      }
    }

    // Checks if page has scrolled
    this.interval = setInterval(() => {
      if (/android/i.test(navigator.userAgent)) {
        if (didScroll) {
          didScroll = false;
          this.onScroll();
        }
      }
    }, 100);

    // Initializes Pull To Refresh
    
    // window.PullToRefresh.init({
    //   mainElement: 'body',
    //   onRefresh: () => {
    //     if (navigator.onLine) {
    //       if (this.props.state.status !== 'pledge') {
    //         API.getPledges()
    //         .then(res => {
    //           this.setState({
    //             pledgeArray: res.data
    //           });
    //         })
    //         .catch(err => console.log(err));
    //       }
    //       else {
    //         let displayName = this.props.state.displayName;

    //         API.getPledgeData(displayName)
    //         .then(res => {
    //           this.setState({
    //             meritArray: res.data.meritArray,
    //             complaintsArray: res.data.complaintsArray
    //           });
    //         })
    //         .catch(err => console.log(err)); 
    //       }
    //     }
    //   },
    //   shouldPullToRefresh: () => {
    //     let contentContainer = document.querySelector('.content-container');
    //     let index = this.state.slideIndex;

    //     if (contentContainer) {
    //       return contentContainer.childNodes[index].scrollTop === 0;
    //     }
    //   }
    // });
  }

  componentDidMount() {
    let contentContainer = document.querySelector('.content-container');

    if (contentContainer) {
      if (/android/i.test(navigator.userAgent)) {
        contentContainer.firstChild.onscroll = watchScroll;
        contentContainer.classList.add('android');
      }
    }
  }

  componentDidUpdate() {
    let index = this.state.slideIndex;
    // let pullToRefresh = document.querySelector('.ptr--ptr');
    let contentContainer = document.querySelector('.content-container');
    
    // if (pullToRefresh) {
    //   pullToRefresh.style.marginTop = '100px';
    // }

    // Changes view margin if view is pledge merit book
    if (contentContainer) {
      if (/android/i.test(navigator.userAgent)) {
        contentContainer.childNodes[index].onscroll = watchScroll;
        contentContainer.classList.add('android');
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Changes touch action of view if scroll is at top of view for mobile
  onScroll = () => {
    let tabs = document.getElementById('pledge-app-tabs').firstChild;
    let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
    let appBar = document.querySelector('.app-header');
    let contentContainer = document.querySelector('.content-container');
    let index = this.state.slideIndex;
    let view = contentContainer.childNodes[index];
    let body = document.body;
    let scrollTop = view.scrollTop;

    // if (view.scrollTop >= 1) {
    //   view.style.touchAction = 'auto';
    // } 
    // else {
    //   view.style.touchAction = 'pan-down';
    // }
    
    // Hides and shows the app bar and the necessary components on scroll
    if (scrollTop > previousScrollTop) {
      // Scroll Down
      tabs.classList.add('hide-tabs');
      appBar.classList.add('hide-app-bar');
      view.classList.add('hide-content-container');
      inkBar.classList.add('hide-content-container');
      body.classList.add('hide-buttons');
    }
    else {
      // Scroll Up
      tabs.classList.remove('hide-tabs');
      appBar.classList.remove('hide-app-bar');
      view.classList.remove('hide-content-container');
      inkBar.classList.remove('hide-content-container');
      body.classList.remove('hide-buttons');
    }
    
    previousScrollTop = scrollTop;
  }

  handleChange = (index) => {
    let title;
    let previousIndex = this.state.previousIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let scrollPosition3 = this.state.scrollPosition3;
    let scrollPosition4 = this.state.scrollPosition4;
    let scrollPosition5 = this.state.scrollPosition5;
    let tabs = document.getElementById('pledge-app-tabs').firstChild;
    let inkBar = document.getElementById('pledge-app-tabs').childNodes[1].firstChild;
    let appBar = document.querySelector('.app-header');
    let contentContainer = document.querySelector('.content-container');
    let view = contentContainer.childNodes[index];
    let body = document.body;
    let scrollPosition = contentContainer.childNodes[previousIndex].scrollTop;;
    let scrolled;

    // Hides and shows the app bar if scrolled for that view for mobile
    if (/android/i.test(navigator.userAgent)) {
      tabs.classList.remove('hide-tabs');
      appBar.classList.remove('hide-app-bar');
      view.classList.remove('hide-content-container');
      inkBar.classList.remove('hide-content-container');
      body.classList.remove('hide-buttons');
    }

    // Sets the title and marks scroll position based on the tab index
    if (index === 0) {
      title = 'Merit Book';
      scrolled = scrollPosition1;
    }
    else if (index === 1) {
      title = 'Contacts';
      scrolled = scrollPosition2;
    }
    else if (index === 2) {
      title = 'Chalkboards';
      scrolled = scrollPosition3;
    }
    else if (index === 3) {
      title = 'Complaints';
      scrolled = scrollPosition4;
    }
    else {
      title = 'Settings';
      scrolled = scrollPosition5;
    }

    // Updates the previous scroll position based on the previous index
    if (previousIndex === 0) {
      scrollPosition1 = scrollPosition;
    }
    else if (previousIndex === 1) {
      scrollPosition2 = scrollPosition;
    }
    else if (previousIndex === 2) {
      scrollPosition3 = scrollPosition;
    }
    else if (previousIndex === 3) {
      scrollPosition4 = scrollPosition;
    }
    else {
      scrollPosition5 = scrollPosition;
    }

    // Sets the view scroll position based on tab
    view.scrollTop = scrolled;

    this.setState({
      title: title,
      slideIndex: index,
      previousIndex: index,
      scrollPosition1: scrollPosition1,
      scrollPosition2: scrollPosition2,
      scrollPosition3: scrollPosition3,
      scrollPosition4: scrollPosition4,
      scrollPosition5: scrollPosition5
    });
  };

  render() {
    return (
      this.state.loaded ? (
        <div>
          <div className="app-header">
            <span> {this.state.title} </span>
          </div>
          
          <Tabs
            id="pledge-app-tabs"
            contentContainerClassName="content-container"
            value={this.state.slideIndex}
            onChange={this.handleChange}
          >
            <Tab 
              icon={<i style={getTabStyle(this.state.slideIndex === 0)} className="icon-star"></i>}
              value={0}
            >
              <LoadableMeritBook 
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeArray={this.state.pledgeArray}
                meritArray={this.state.meritArray}
                totalMerits={this.state.totalMerits}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 1)} className="icon-address-book"></i>}
              value={1}
            >
              <LoadableContacts
                state={this.props.state}
                actives={this.state.activeArray}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 2)} className="icon-calendar-empty"></i>}
              value={2}
            >
              <LoadableChalkboards 
                state={this.props.state}
                index={this.state.slideIndex}
                myHostingChalkboards={this.state.myHostingChalkboards}
                myAttendingChalkboards={this.state.myAttendingChalkboards}
                myCompletedChalkboards={this.state.myCompletedChalkboards}
                upcomingChalkboards={this.state.upcomingChalkboards}
                completedChalkboards={this.state.completedChalkboards}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 3)} className="icon-thumbs-down-alt"></i>}
              value={3}
            >
              <LoadableComplaints
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeComplaints={this.state.pledgeComplaints}
                activeComplaints={this.state.activeComplaints}
                pendingComplaints={this.state.pendingComplaints}
                approvedComplaints={this.state.approvedComplaints}
                handleRequestOpen={this.props.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={getTabStyle(this.state.slideIndex === 4)} className="icon-cog"></i>}
              value={4}
            >
              <LoadableSettings 
                state={this.props.state} 
                logoutCallBack={this.props.logoutCallBack} 
                history={this.props.history}
              />
            </Tab>
          </Tabs>
        </div>
      ) : (
        <LoadingPledgeApp />
      )
    )
  }
}