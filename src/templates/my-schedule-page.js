import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import {
  updateFiltersFromHash,
  updateFilter,
  MY_SCHEDULE_UPDATE_FILTER,
  MY_SCHEDULE_UPDATE_FILTERS,
} from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import AccessTracker from "../components/AttendeeToAttendeeWidgetComponent";
import FilterButton from "../components/FilterButton";

import { PHASES } from "../utils/phasesUtils";
import styles from "../styles/full-schedule.module.scss";

const MySchedulePage = ({
  summit,
    schedules,
  summitPhase,
  isLoggedUser,
  location,
  colorSettings,
  updateFilter,
  updateFiltersFromHash,
}) => {
  const [showFilters, setShowfilters] = useState(false);
  const scheduleState = schedules.find( s => s.key === 'mysched');
  const {events, allEvents, filters, view, timezone, colorSource} = scheduleState || {};

  const filterProps = {
    summit,
    events,
    allEvents,
    filters: pickBy(filters, (value) => value.enabled),
    triggerAction: (action, payload) => {
      updateFilter(payload, MY_SCHEDULE_UPDATE_FILTER);
    },
    marketingSettings: colorSettings,
    colorSource: colorSource,
  };

  let scheduleProps = {
    summit,
    events,
    filters,
    view,
    timezone,
    colorSource,
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`, { state: { previousUrl: location.pathname }}),
      onStartChat: null,
    };
  }

  useEffect(() => {
    updateFiltersFromHash(filters, view, MY_SCHEDULE_UPDATE_FILTERS);
  });

  if (!summit || !scheduleState) return null;

  return (
    <Layout location={location}>
      <div className="container">
        <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ""}`}>
          <div className={styles.scheduleWrapper}>
            <FullSchedule {...scheduleProps} />
          </div>
          <div className={styles.filterWrapper}>
            <ScheduleFilters {...filterProps} />
          </div>
          <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)} />
        </div>
      </div>
      <AttendanceTrackerComponent />
      <AccessTracker />
    </Layout>
  );
};

MySchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({summitState, clockState, loggedUserState, allSchedulesState, settingState }) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  colorSettings: settingState.colorSettings,
  schedules: allSchedulesState.schedules,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
})(MySchedulePage);
