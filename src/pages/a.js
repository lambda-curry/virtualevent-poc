import React from "react"
import { Router, Location } from "@reach/router"
import { connect } from 'react-redux'

import LoginPage from "../templates/login-page"
import HomePage from "../templates/home-page"
import EventPage from "../templates/event-page"
import SchedulePage from "../templates/schedule-page";

import ShowTimeRoute from '../routes/ShowTimeRoute'
import PublicRoute from "../routes/PublicRoute"

const App = ({ isLoggedUser, user, startDate, marketingNow }) => {
  return (
    <Location>
      {({ location }) => (
        <Router basepath="/a" >
          <ShowTimeRoute path="/" startDate={startDate} marketingNow={marketingNow} component={HomePage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <ShowTimeRoute path="/event/:eventId" startDate={startDate} marketingNow={marketingNow} component={EventPage} isLoggedIn={isLoggedUser} user={user} location={location} />
          <PublicRoute path="/schedule" component={SchedulePage} location={location} />
          <LoginPage path="/login" location={location} />
        </Router>
      )}
    </Location>
  )
}

const mapStateToProps = ({ loggedUserState, userState, summitState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  startDate: summitState.summit.start_date,
  marketingNow: summitState.marketingNow,
  user: userState.userProfile
})

export default connect(mapStateToProps)(App)