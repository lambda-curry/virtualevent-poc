import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent";

import { PHASES } from '../utils/phasesUtils'

import SummitObject from '../content/summit.json'
import envVariables from "../utils/envVariables";
import {AttendanceTracker} from "openstack-uicore-foundation/lib/components";

const SchedulePage = ({summit_phase, isLoggedUser, loggedUser, mySchedule}) => {

  let { summit } = SummitObject;

  let title = mySchedule ? 'My Schedule' : 'Schedule';

  let scheduleProps = {}
  if (isLoggedUser && summit_phase !== PHASES.BEFORE) {
    scheduleProps = { ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
    }
  }

  return (
    <Layout>
      <div className="container">
        <h1>{ title }</h1>
        <p>All times below are listed in CDT unless otherwise noted</p>
        <hr/>
        <ScheduleLiteComponent
          {...scheduleProps}
          accessToken={loggedUser.accessToken}
          landscape={true}
          showNav={true}
          showFilters={true}
          showAllEvents={true}
          yourSchedule={mySchedule}
          eventCount={100}
        />
      </div>
      <AttendanceTracker
          summitId={summit.id}
          apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
          accessToken={loggedUser.accessToken}
      />
    </Layout>
  )
}

SchedulePage.propTypes = {
  summit_phase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
  loggedUser: PropTypes.object,
}

const mapStateToProps = ({ clockState, loggedUserState }) => ({
  summit_phase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  loggedUser: loggedUserState,
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);
