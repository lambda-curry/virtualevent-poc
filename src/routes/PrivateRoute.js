import React from "react"
import { navigate } from "gatsby"

import envVariables from '../utils/envVariables';

import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const PrivateRoute = ({ component: Component, isLoggedIn, location, user, ...rest }) => {

  const ticketPurchased = user.summit_tickets?.includes(envVariables.SUMMIT_ID);

  if (!isLoggedIn && location.pathname !== `/`) {
    navigate('/', {
      state: {
        backUrl: `${location.href}`
      }
    })
    return null
  } else if (!ticketPurchased) {
    // navigate('/a/login', {
    //   state: {
    //     backUrl: `${location.href}`
    //   }
    // })    
  }

  const clientId = envVariables.OAUTH2_CLIENT_ID;
  const idpBaseUrl = envVariables.IDP_BASE_URL;

  return (
    <>
      <OPSessionChecker clientId={clientId} idpBaseUrl={idpBaseUrl} />
      <Component location={location} {...rest} />
    </>
  );
}

export default PrivateRoute