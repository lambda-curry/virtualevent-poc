import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import envVariables from '../utils/envVariables';
import { isAuthorizedUser, isAuthorizedBadge } from '../utils/authorizedGroups';

import { PHASES } from '../utils/phasesUtils'

import { getUserProfile } from "../actions/user-actions";

import HeroComponent from '../components/HeroComponent'
import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const PrivateRoute = ({ component: Component, isLoggedIn, location, user: { loading, userProfile }, summit_phase, getUserProfile, ...rest }) => {

  const [isAuthorized, setIsAuthorized] = useState(null);
  const [hasTicket, setHasTicket] = useState(null);

  useEffect(() => {
    if (userProfile === null || (isAuthorized === false && hasTicket === false)) {
      getUserProfile();
    } else if (userProfile !== null) {
      setIsAuthorized(() => isAuthorizedUser(userProfile.groups));
      setHasTicket(() => userProfile.summit_tickets?.length > 0)
    }
  }, [userProfile]);

  if (!isLoggedIn && location.pathname !== `/`) {
    navigate('/', {
      state: {
        backUrl: `${location.href}`
      }
    })
    return null
  }

  if (loading && userProfile === null) {
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }

  if (isAuthorized === false && hasTicket === false) {
    navigate('/authz/ticket', {
      state: {
        error: 'no-ticket'
      }
    })
    return null
  }

  if (isAuthorized === false && summit_phase === PHASES.BEFORE) {
    setTimeout(() => {
      navigate('/')
    }, 3000);
    return (
      <HeroComponent
        title="Its not yet show time!"
      />
    )
  }

  // if (eventId && !isAuthorizedBadge(eventId)) {
  //   setTimeout(() => {
  //     navigate('/')
  //   }, 3000);
  //   return (
  //     <HeroComponent
  //       title="You are not authorized to view this session!"
  //     />
  //   )
  // }

  const clientId = envVariables.OAUTH2_CLIENT_ID;
  const idpBaseUrl = envVariables.IDP_BASE_URL;

  if (isAuthorized === true || hasTicket === true) {
    return (
      <>
        <OPSessionChecker clientId={clientId} idpBaseUrl={idpBaseUrl} />
        <Component location={location} {...rest} />
      </>
    );
  } else {
    return null;
  }


}


export default connect(null, { getUserProfile })(PrivateRoute)