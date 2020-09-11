import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent";

import { PHASES } from '../utils/phasesUtils'

import SummitObject from '../content/summit.json'

const SchedulePage = ({summit_phase, isLoggedUser, loggedUser}) => {

  let { summit } = SummitObject;

  let scheduleProps = {}
  if (isLoggedUser && summit_phase !== PHASES.BEFORE) {
    scheduleProps = { ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
    }
  }

  return (
    <Layout marketing={true}>
      <div className="container">
        <h1>Schedule</h1>
        <hr/>
        <ScheduleLiteComponent
          {...scheduleProps}
          accessToken={loggedUser.accessToken}
          landscape={true}
          showNav={true}
          showFilters={true}
          showAllEvents={true}
          eventCount={100}
          showDetails={true}
        />
      </div>
    </Layout>
  )
}

SchedulePage.propTypes = {
  summit_phase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
  loggedUser: PropTypes.object,
}

const mapStateToProps = ({ summitState, loggedUserState }) => ({
  summit_phase: summitState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  loggedUser: loggedUserState,
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);
