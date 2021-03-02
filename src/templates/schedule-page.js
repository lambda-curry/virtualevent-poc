import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import { PHASES } from '../utils/phasesUtils'

const SchedulePage = ({summitPhase, isLoggedUser, loggedUser, mySchedule, location}) => {

  let title = mySchedule ? 'My Schedule' : 'Schedule';

  let scheduleProps = {}
  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = { ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
    }
  }

  return (
    <Layout location={location}>
      <div className="container">
        <h1>{ title }</h1>
        <hr/>
        <ScheduleLiteComponent
          {...scheduleProps}
          landscape={true}
          showNav={true}
          showFilters={true}
          showAllEvents={true}
          yourSchedule={mySchedule}
          eventCount={100}
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