import React from "react"
import { navigate } from "gatsby"

import envVariables from '../utils/envVariables';
import authorizedUser from '../utils/authorizedGroups';

import HeroComponent from '../components/HeroComponent'
import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const PrivateRoute = ({ component: Component, isLoggedIn, location, user, startDate, marketingNow, ...rest }) => {

  if (!isLoggedIn && location.pathname !== `/`) {
    navigate('/', {
      state: {
        backUrl: `${location.href}`
      }
    })
    return null
  }

  if (!user || !user.groups) {
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }

  const isAuthorized = authorizedUser(user.groups);

  const ticketPurchased = user.summit_tickets?.length > 0;

  if (!isAuthorized && !ticketPurchased) {
    navigate('/authz/ticket', {
      state: {
        error: 'no-ticket'
      }
    })
    return null
  }

  if (!isAuthorized && !(startDate < marketingNow + 900)) {
    setTimeout(() => {
      navigate('/')
    }, 3000);
    return (
      <HeroComponent
        title="Its not yet show time!"
      />
    )
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