import React from "react"
import { Router, Location } from "@reach/router"
import { connect } from 'react-redux'

import Layout from "../components/Layout"
import LoginPage from "../templates/login-page"
import HomePage from "../templates/home-page"
import EventPage from "../templates/event-page"
import TokenExpirePage from "../templates/token-expire-page"

import Loadable from "@loadable/component"

const LoadablePrivateRoute = Loadable(() => import('../routes/PrivateRoute'))

const App = ({ isLoggedUser }) => (
  <Location>
    {({ location }) => (
      <Router basepath="/a" >
        <LoadablePrivateRoute path="/" component={HomePage} isLoggedIn={isLoggedUser} location={location} />
        <LoadablePrivateRoute path="/event/:eventId" component={EventPage} isLoggedIn={isLoggedUser} location={location} />
        <TokenExpirePage path="/expired" location={location} />
        <LoginPage path="/login" location={location} />
      </Router>
    )}
  </Location>
)

const mapStateToProps = ({ loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  backUrl: loggedUserState.backUrl,
})

export default connect(mapStateToProps)(App)