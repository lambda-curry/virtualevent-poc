import React, {useEffect} from "react";
import { connect } from "react-redux";

import { PHASES } from "../utils/phasesUtils";
import { requireExtraQuestions, doVirtualCheckIn } from "../actions/user-actions";
import HeroComponent from "../components/HeroComponent";
import { FragmentParser } from "openstack-uicore-foundation/lib/components";
import moment from "moment-timezone";

/**
 *
 * @param children
 * @param isAuthorized
 * @param summit_phase
 * @param requireExtraQuestions
 * @param hasTicket
 * @param userProfile
 * @param doVirtualCheckIn
 * @returns {JSX.Element|*}
 * @constructor
 */
const ShowOpenRoute = ({
  children,
  isAuthorized,
  summit_phase,
  requireExtraQuestions,
  hasTicket,
  userProfile,
  doVirtualCheckIn
}) => {

  // if we are at show time, and we have an attendee, perform virtual check-in
  useEffect(() => {
    if(hasTicket && summit_phase === PHASES.DURING){
      // verify if we have an attendee , and if so do the virtual check in
      let attendee = userProfile?.summit_tickets[0]?.owner || null;
      if(attendee)
        doVirtualCheckIn(attendee);
    }
  },[summit_phase, hasTicket, userProfile]);

  const userCanByPassAuthz = () => {
    return isAuthorized;
  };

  // if we are providing the now fragment param then let the clock
  // component set it, so we need to bypass this next check
  const fragmentParser = new FragmentParser();
  const nowQS = fragmentParser.getParam('now');
  let shouldBypassCheck = false;
  if(nowQS) {
    const momentQS = moment.tz(nowQS, 'YYYY-MM-DD,hh:mm:ss', 'UTC');
    if (momentQS.isValid()) {
      shouldBypassCheck = true;
    }
  }

  // if summit didnt started yet ...
  if (!shouldBypassCheck && !userCanByPassAuthz() && summit_phase === PHASES.BEFORE) {
    console.log('ShowOpenRoute::rendering no show time')
    return <HeroComponent title="Its not yet show time!" redirectTo="/" />;
  }

  if (requireExtraQuestions()) {
    return (
      <HeroComponent
        title="You need to complete some extra questions before entering the event"
        redirectTo="/a/extra-questions"
      />
    );
  }
  console.log('ShowOpenRoute::rendering children');

  return children;
};

const mapStateToProps = ({ userState }) => ({
  isAuthorized: userState.isAuthorized,
  hasTicket: userState.hasTicket,
  userProfile: userState.userProfile,
});

export default connect(mapStateToProps, {
  requireExtraQuestions,
  doVirtualCheckIn
})(ShowOpenRoute);
