import React from "react"
import { navigate } from "gatsby"
import { Redirect } from '@reach/router'

import PrivateRoute from './PrivateRoute'

const ShowTimeRoute = ({ component: Component, startDate, marketingNow, isLoggedIn, location, user, ...rest }) => {

  if (startDate < marketingNow) {
    return <PrivateRoute component={Component} location={location} isLoggedIn={isLoggedIn} user={user} {...rest} />
  } else {
    navigate('/')
    return null
  }
}

export default ShowTimeRoute