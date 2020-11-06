import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import envVariables from '../utils/envVariables';
import { isAuthorizedUser, isAuthorizedBadge } from '../utils/authorizedGroups';

import { PHASES } from '../utils/phasesUtils'

import { getUserProfile } from "../actions/user-actions";

import HeroComponent from '../components/HeroComponent'
import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const PrivateRoute = ({ component: Component, isLoggedIn, location, eventId, user: { loading, userProfile }, summit_phase, getUserProfile, ...rest }) => {

  const [hasTicket, setHasTicket] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [updatingUserProfile, setUpdatingUserProfile] = useState(null);

  useEffect(() => {

    if (!isLoggedIn) return;

    if (userProfile === null) {
      getUserProfile();
      return;
    } else if (updatingUserProfile) {
      setUpdatingUserProfile(false);
    }

    if (hasTicket === null || isAuthorized === null || updatingUserProfile === true) {
      setIsAuthorized(() => isAuthorizedUser(userProfile.groups));
      setHasTicket(() => userProfile.summit_tickets?.length > 0);
      return;
    }

    if (isAuthorized === false && hasTicket === false && (updatingUserProfile === null || updatingUserProfile === false)) {
      getUserProfile();
      setUpdatingUserProfile(true);
      return;
    }
  }, [userProfile, hasTicket, isAuthorized]);

  if (!isLoggedIn) {
    navigate('/', {
      state: {
        backUrl: `${location.pathname}`
      }
    })
    return null
  }

  if (loading || userProfile === null || hasTicket === null || isAuthorized === null || (hasTicket === false && isAuthorized === false && updatingUserProfile !== false)) {
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
    return (
      <HeroComponent
        title="Its not yet show time!"
        redirectTo="/"
      />
    )
  }

  if (eventId && userProfile && !isAuthorizedBadge(eventId, userProfile.summit_tickets)) {
    setTimeout(() => {
      navigate(location.state?.previousUrl ? location.state.previousUrl : '/')
    }, 3000);
    return (
      <HeroComponent
        title="You are not authorized to view this session!"
      />
    )
  }

  return (
    <>
      <OPSessionChecker clientId={envVariables.OAUTH2_CLIENT_ID} idpBaseUrl={envVariables.IDP_BASE_URL} />
      <Component location={location} eventId={eventId} {...rest} />
    </>
  );
}

export default connect(null, { getUserProfile })(PrivateRoute)