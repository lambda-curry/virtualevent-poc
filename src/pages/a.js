import React from "react"
import { Router, Location } from "@reach/router"
import { connect } from 'react-redux'

import LoginPage from "../templates/login-page"
import HomePage from "../templates/home-page"
import EventPage from "../templates/event-page"
import SchedulePage from "../templates/schedule-page";
import MySchedulePage from "../templates/my-schedule-page";
import SponsorPage from "../templates/sponsor-page"

import SummitObject from '../content/summit.json'

import PrivateRoute from '../routes/PrivateRoute'
import PublicRoute from "../routes/PublicRoute"

const App = ({ isLoggedUser, user, summit_phase }) => {  
  return (
    <Location>
      {({ location }) => (
        <Router basepath="/a" >
          <PrivateRoute path="/" summit_phase={summit_phase} component={HomePage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/event/:eventId" summit_phase={summit_phase} component={EventPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PrivateRoute path="/sponsor/:sponsorId" component={SponsorPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PublicRoute path="/schedule" component={SchedulePage} location={location} />
          <PublicRoute path="/my-schedule" component={MySchedulePage} location={location} />
          <LoginPage path="/login" location={location} />
        </Router>
      )}
    </Location>
  )
}

const mapStateToProps = ({ loggedUserState, userState, clockState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  summit_phase: clockState.summit_phase,
  user: userState
})

export default connect(mapStateToProps)(App)