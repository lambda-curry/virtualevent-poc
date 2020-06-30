import React, { Component } from "react"
import { navigate } from "gatsby"

import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const PrivateRoute = ({ component: Component, isLoggedIn, location, ...rest }) => {

  if (!isLoggedIn && location.pathname !== `/a/login`) {
    navigate("/a/login")
    return null
  }

  const clientId = typeof window === 'object' ? window.OAUTH2_CLIENT_ID : process.env.OAUTH2_CLIENT_ID
  const idpBaseUrl = typeof window === 'object' ? window.IDP_BASE_URL : process.env.GATSBY_IDP_BASE_URL

  return (
    <React.Fragment>
      <OPSessionChecker clientId={clientId} idpBaseUrl={idpBaseUrl} />
      <Component location={location} {...rest} />
    </React.Fragment>
  );
}

export default PrivateRoute