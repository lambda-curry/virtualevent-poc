import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import {
  updateFiltersFromHash,
  updateFilter,
  getShareLink, MY_SCHEDULE_UPDATE_FILTER, MY_SCHEDULE_UPDATE_FILTERS,
} from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";

import { PHASES } from "../utils/phasesUtils";

const MySchedulePage = ({
  summit,
  summitPhase,
  isLoggedUser,
  location,
  events,
  allEvents,
  filters,
  view,
  colorSource,
  colorSettings,
  updateFilter,
  updateFiltersFromHash,
}) => {
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
    colorSource,
    getShareLink: () => getShareLink(filters, view),
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      onStartChat: console.log,
    };
  }

  useEffect(() => {
    updateFiltersFromHash(filters, MY_SCHEDULE_UPDATE_FILTERS);
  });

  if (!summit) return null;

  return (
    <Layout location={location}>
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters px-6 pt-6 pb-0">
            <FullSchedule {...scheduleProps} />
          </div>
          <div className="column is-one-quarter px-6 pt-6 pb-0">
            <ScheduleFilters {...filterProps} />
          </div>
        </div>
      </div>
      <AttendanceTrackerComponent />
    </Layout>
  );
};

MySchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({
  summitState,
  clockState,
  loggedUserState,
  myScheduleState,
  settingState,
}) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  events: myScheduleState.events,
  allEvents: myScheduleState.allEvents,
  filters: myScheduleState.filters,
  view: myScheduleState.view,
  colorSource: myScheduleState.colorSource,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
})(MySchedulePage);
