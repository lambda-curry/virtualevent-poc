import React from "react";
import { connect } from "react-redux";
import { navigate } from "gatsby";

import { isAuthorizedBadge } from "../utils/authorizedGroups";
import HeroComponent from "../components/HeroComponent";

const WithBadgeRoute = ({ children, location, eventId, userProfile, hasTicket, isAuthorized }) => {
  const hasBadgeForEvent = eventId && userProfile && isAuthorizedBadge(eventId, userProfile.summit_tickets);
  const userIsAuthz = hasTicket || isAuthorized;

  const getTitle = () => {
    if (!userIsAuthz)
      return "Sorry. You don't have a ticket for this event.";
    if (!eventId || !userProfile)
      return "Sorry. You are not authorized to view this session.";
    if (!hasBadgeForEvent)
      return "Sorry. You need a special badge to view this session.";
  };

  if (!userIsAuthz || !hasBadgeForEvent) {
    return <HeroComponent title={getTitle()} redirectTo={location.state?.previousUrl || "/"}/>;
  }

  return children;
};

const mapStateToProps = ({ userState }) => ({
  userProfile: userState.userProfile,
  hasTicket: userState.hasTicket,
  isAuthorized: userState.isAuthorized,
});

export default connect(mapStateToProps)(WithBadgeRoute);
