import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import FullSchedule from '../components/FullSchedule'
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import styles from '../styles/schedule.module.scss'

import { PHASES } from '../utils/phasesUtils'

const SchedulePage = ({ summitPhase, isLoggedUser, location }) => {

  let scheduleProps = {};

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      onStartChat: console.log,
    }
  }

  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(70);

  const handleScroll = () => {
    const position = window.pageYOffset;
    const header = document.querySelector('header')
    if(header){
      setHeaderHeight(header.clientHeight);
    }
    if(position < headerHeight) setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout location={location}>
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters px-6 pt-6 pb-0">
            <FullSchedule {...scheduleProps} />
          </div>
          <div className={`column is-one-quarter px-6 pt-0 pb-6 ${styles.filterContainer}`} style={{ top: headerHeight - scrollPosition }}>
            <ScheduleFilters />
          </div>
        </div>

      </div>
      <AttendanceTrackerComponent />
    </Layout>
  )
};

SchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({ clockState, loggedUserState }) => ({
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);