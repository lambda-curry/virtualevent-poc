import React, { useEffect, useState } from "react"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import { isAuthorizedBadge } from '../utils/authorizedGroups';
import { PHASES } from '../utils/phasesUtils'
import { getUserProfile, requireExtraQuestions } from "../actions/user-actions";
import HeroComponent from '../components/HeroComponent'


const PrivateRoute = ({
                        component: Component,
                        isLoggedIn,
                        location,
                        eventId,
                        user: { loading, userProfile, hasTicket, isAuthorized },
                        summit_phase,
                        getUserProfile,
                        requireExtraQuestions,
                        ...rest }) => {

  const [fetchingUserProfile, setFetchingUserProfile] = useState(isLoggedIn);

  const userIsAuthz = () => {
    return (hasTicket || isAuthorized)
  }

  const userCanByPassAuthz = () => {
    return isAuthorized;
  }

  const userIsReady = () => {
    // we have an user profile , its not reloading it and we are not fetching it
    return userProfile && !fetchingUserProfile;
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    // if the user is not authz and we accessing a private route , get fresh data to recheck
    // authz condition ( new tickets / new groups ) after every render of the route
    if(fetchingUserProfile) {
      getUserProfile().then(() => setFetchingUserProfile(false));
    }
  }, [fetchingUserProfile, getUserProfile, isLoggedIn ]);

  if (!isLoggedIn) {
    navigate('/', {
      state: {
        backUrl: `${location.pathname}`
      }
    })
    return null
  }

  // we are checking credentials if userProfile is being loading yet
  if (!userIsReady()) {
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }

  // if summit didnt started yet ...
  if (!userCanByPassAuthz() && summit_phase === PHASES.BEFORE) {
    return (
        <HeroComponent
            title="Its not yet show time!"
            redirectTo="/"
        />
    )
  }

  // if we are not authorized
  if (!userIsAuthz() && location.pathname !== "/a/extra-questions") {
    navigate('/authz/ticket', {
      state: {
        error: 'no-ticket'
      }
    })
    return null
  }

  if (requireExtraQuestions()) {
    // of we already on extra questions page just render the component
    if (location.pathname === "/a/extra-questions") {
      return (<Component location={location} eventId={eventId} {...rest} />);
    }

    return (
        <HeroComponent
          title="You need to complete some extra questions before entering the event"
          redirectTo="/a/extra-questions"
        />
      );
  }

  // if we are at an activity page ...
  if (!userIsAuthz() && eventId && userIsReady() && !isAuthorizedBadge(eventId, userProfile.summit_tickets)) {
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

export default connect(null, {
  getUserProfile,
  requireExtraQuestions
})(PrivateRoute)