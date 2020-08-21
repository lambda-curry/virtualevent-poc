import React from "react"
import { Router, Location } from "@reach/router"
import { connect } from 'react-redux'

import LoginPage from "../templates/login-page"
import HomePage from "../templates/home-page"
import EventPage from "../templates/event-page"
import SchedulePage from "../templates/schedule-page";

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
          <PublicRoute path="/schedule" component={SchedulePage} location={location} />
          <LoginPage path="/login" location={location} />
        </Router>
      )}
    </Location>
  )
}

const mapStateToProps = ({ loggedUserState, userState, summitState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  summit_phase: summitState.summit_phase,
  user: userState.userProfile
})

export default connect(mapStateToProps)(App)