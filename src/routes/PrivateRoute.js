import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import { isAuthorizedBadge } from '../utils/authorizedGroups';
import { PHASES } from '../utils/phasesUtils'
import { getUserProfile } from "../actions/user-actions";
import { checkEvents } from "../actions/event-actions";
import HeroComponent from '../components/HeroComponent'

const PrivateRoute = ({ component: Component, isLoggedIn, location, eventId, user: { loading, userProfile, hasTicket, isAuthorized }, summit_phase, getUserProfile, checkEvents, ...rest }) => {

  useEffect(() => {
    checkEvents();
  }, [])

  const [userRevalidation, setUserRevalidation] = useState(null);

  useEffect(() => {

    if (!isLoggedIn) return;

    if (userProfile === null) {
      getUserProfile();
      return;
    } else if (userRevalidation) {
      setUserRevalidation(false);
    }

    if (userRevalidation === null && (isAuthorized === false && hasTicket === false)) {
      getUserProfile();
      setUserRevalidation(true);
      return;
    } else {
      setUserRevalidation(false);
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

  if (loading || userProfile === null || hasTicket === null || isAuthorized === null || userRevalidation === null ||
    (hasTicket === false && isAuthorized === false && userRevalidation === true)) {
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

  return (<Component location={location} eventId={eventId} {...rest} />);
}

export default connect(null, { getUserProfile, checkEvents })(PrivateRoute)