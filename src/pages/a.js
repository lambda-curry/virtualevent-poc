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
import WithAuthRoute from '../routes/WithAuthRoute'
import withSessionChecker from "../utils/withSessionChecker"
import ExtraQuestionsPage from "../templates/extra-questions-page"
import MySchedulePage from "../templates/my-schedule-page";
import ShowOpenRoute from "../routes/ShowOpenRoute";
import WithBadgeRoute from "../routes/WithBadgeRoute";

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
          <SchedulePage path="/schedule" location={location} />
          <WithAuthRoute path="/" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location}>
            <MySchedulePage path="/my-schedule" location={location} summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user}/>
            <ExtraQuestionsPage path="/extra-questions" isLoggedIn={isLoggedUser} user={user} location={location} />
            <FullProfilePage path="/profile" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location} />
            <ShowOpenRoute path="/" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location}>
              <WithBadgeRoute path="/event/:eventId" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location}>
                <EventPage path="/" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location} />
              </WithBadgeRoute>
              <HomePage path="/" isLoggedIn={isLoggedUser} user={user} location={location} />
              <SponsorPage path="/sponsor/:sponsorId" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location} />
              <ExpoHallPage path="/sponsors/" summit_phase={summit_phase} isLoggedIn={isLoggedUser} user={user} location={location} />
            </ShowOpenRoute>
          </WithAuthRoute>
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