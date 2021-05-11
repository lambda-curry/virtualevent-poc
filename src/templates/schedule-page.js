import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import LiteScheduleComponent from '../components/LiteScheduleComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import { PHASES } from '../utils/phasesUtils'

const SchedulePage = ({ summitPhase, isLoggedUser, loggedUser, mySchedule, location }) => {

  let title = mySchedule ? 'My Schedule' : 'Schedule';

  let scheduleProps = {}
  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
    }
  }

  return (
    <Layout location={location}>
      <div className="container">
        <h1>{title}</h1>
        <hr />
        <LiteScheduleComponent
          {...scheduleProps}
          showSearch={true}
          showAllEvents={true}
          yourSchedule={mySchedule}
          showDetails={true}
        />
      </div>
      <AttendanceTrackerComponent />
    </Layout>
  )
}

SchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
}

const mapStateToProps = ({ clockState, loggedUserState }) => ({
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);