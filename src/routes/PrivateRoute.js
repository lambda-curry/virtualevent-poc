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

    if (isAuthorized === null || updatingUserProfile === true) {
      setIsAuthorized(() => isAuthorizedUser(userProfile.groups));
      return;
    }

    if (isAuthorized === false && updatingUserProfile === null) {
      getUserProfile();
      setUpdatingUserProfile(true);
      return;
    }
  }, [userProfile, isAuthorized]);

  if (!isLoggedIn) {
    navigate('/', {
      state: {
        backUrl: `${location.pathname}`
      }
    })
    return null
  }

  if (loading || userProfile === null || isAuthorized === null || (isAuthorized === false && updatingUserProfile !== false)) {
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }

  if (isAuthorized === false && summit_phase === PHASES.BEFORE) {
    return (
      <HeroComponent
        title="Its not yet show time!"
        redirectTo="/"
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