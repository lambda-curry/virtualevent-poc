import React, {useEffect} from "react";
import { connect } from "react-redux";
import { isAuthorizedBadge } from "../utils/authorizedGroups";
import HeroComponent from "../components/HeroComponent";
import {getEventById} from "../actions/event-actions";

const WithBadgeRoute = ({ children, location, eventId, event, loading, userProfile, hasTicket, isAuthorized, getEventById }) => {
  const hasBadgeForEvent = eventId && userProfile && isAuthorizedBadge(event, userProfile.summit_tickets);
  const userIsAuthz = hasTicket || isAuthorized;
  const needsToLoadEvent = eventId && eventId != event?.id;

  const getTitle = () => {
    if (!userIsAuthz)
      return "Sorry. You don't have a ticket for this event.";
    if (!eventId || !userProfile)
      return "Sorry. You are not authorized to view this session.";
    if (!hasBadgeForEvent)
      return "Sorry. You need a special badge to view this session.";
  };

  useEffect(() => {
    if (eventId) {
      getEventById(eventId);
    }
  }, eventId);

  if (loading || needsToLoadEvent) {
    return <HeroComponent title="Loading event" />;
  }

  if (!userIsAuthz || !hasBadgeForEvent) {
    return <HeroComponent title={getTitle()} redirectTo={location.state?.previousUrl || "/"}/>;
  }

  return children;
};

const mapStateToProps = ({ userState, eventState }) => ({
  userProfile: userState.userProfile,
  hasTicket: userState.hasTicket,
  isAuthorized: userState.isAuthorized,
  event: eventState.event,
  loading: eventState.loading,
});

export default connect(mapStateToProps, {getEventById})(WithBadgeRoute);
