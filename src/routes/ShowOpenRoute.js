import React from "react";
import { connect } from "react-redux";

import { PHASES } from "../utils/phasesUtils";
import { getUserProfile, requireExtraQuestions } from "../actions/user-actions";
import HeroComponent from "../components/HeroComponent";

const ShowOpenRoute = ({
  children,
  isAuthorized,
  summit_phase,
  requireExtraQuestions,
}) => {
  const userCanByPassAuthz = () => {
    return isAuthorized;
  };

  // if summit didnt started yet ...
  if (!userCanByPassAuthz() && summit_phase === PHASES.BEFORE) {
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

  return children;
};

const mapStateToProps = ({ userState }) => ({
  isAuthorized: userState.isAuthorized,
});

export default connect(mapStateToProps, {
  getUserProfile,
  requireExtraQuestions,
})(ShowOpenRoute);
