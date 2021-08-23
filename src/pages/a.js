import React, {useEffect} from "react"
import { Router, Location } from "@reach/router"
import { connect } from 'react-redux'
import { syncData } from '../actions/base-actions';
import settings from '../content/settings';

import LoginPage from "../templates/login-page"
import HomePage from "../templates/home-page"
import EventPage from "../templates/event-page"
import SchedulePage from "../templates/schedule-page";
import SponsorPage from "../templates/sponsor-page"
import ExpoHallPage from "../templates/expo-hall-page"
import FullProfilePage from "../templates/full-profile-page"
import PrivateRoute from '../routes/PrivateRoute'
import PublicRoute from "../routes/PublicRoute"
import withSessionChecker from "../utils/withSessionChecker"
import extraQuestionsPage from "../templates/extra-questions-page"
import MySchedulePage from "../templates/my-schedule-page";

const App = ({ isLoggedUser, user, summit_phase, lastBuild, syncData }) => {

  useEffect(() => {
    if (!lastBuild || settings.lastBuild > lastBuild) {
      syncData();
    }
  }, [lastBuild, syncData]);

  return (
    <Location>
      {({ location }) => (
        <Router basepath="/a" >
          <PrivateRoute path="/" summit_phase={summit_phase} component={HomePage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/event/:eventId" summit_phase={summit_phase} component={EventPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/sponsor/:sponsorId" summit_phase={summit_phase} component={SponsorPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/sponsors/" summit_phase={summit_phase} component={ExpoHallPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/profile" summit_phase={summit_phase} component={FullProfilePage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/extra-questions" component={extraQuestionsPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PublicRoute path="/schedule" component={SchedulePage} location={location} />
          <PrivateRoute path="/my-schedule" component={MySchedulePage} location={location} summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user}/>
        </Router>
      )}
    </Location>
  )
};

const mapStateToProps = ({ loggedUserState, userState, clockState, settingState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  summit_phase: clockState.summit_phase,
  user: userState,
  lastBuild: settingState.lastBuild
});

export default connect(mapStateToProps, { syncData })(withSessionChecker(App))