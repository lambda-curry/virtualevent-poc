// import ...
import React, { Component } from "react"
import { navigate } from "gatsby"

const PrivateRoute = ({ component: Component, isLoggedIn, location, ...rest }) => {

  if (!isLoggedIn && location.pathname !== `/a/login`) {
    navigate("/a/login")
    return null
  }  

  return <Component location={location} {...rest} />
}
export default PrivateRoute