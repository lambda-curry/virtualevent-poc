import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import { updateFiltersFromHash, updateFilter, reloadScheduleData } from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import AccessTracker from "../components/AttendeeToAttendeeWidgetComponent";
import { PageScrollInspector, SCROLL_DIRECTION } from  '../components/PageScrollInspector';
import { PHASES } from "../utils/phasesUtils";
import FilterButton from "../components/FilterButton";
import styles from "../styles/full-schedule.module.scss";
import NotFoundPage from "../pages/404";

const SchedulePage = ({summit, schedules, summitPhase, isLoggedUser, location, colorSettings, updateFilter, updateFiltersFromHash, scheduleProps, schedKey, reloadScheduleData }) => {

  const [showFilters, setShowfilters] = useState(false);

  const filtersWrapperRef = useRef(null);

  useEffect(() => {
    if(schedules.length > 0) return;
    // reload schedule data due we dont have the data on the reducer loaded
    reloadScheduleData();
  }, [schedules])

  useEffect(() => {
    updateFiltersFromHash(schedKey, filters, view);
  }, [schedKey, filters, view, updateFiltersFromHash]);

  const onScrollDirectionChange = useCallback(direction => {
    if (direction === SCROLL_DIRECTION.UP)
      filtersWrapperRef.current.scroll({ top: 0, behavior: 'smooth' });
  }, [filtersWrapperRef]);

  const onPageBottomReached = useCallback(pageBottomReached => {
    if (pageBottomReached)
      filtersWrapperRef.current.scroll({ top: filtersWrapperRef.current.scrollHeight, behavior: 'smooth' });
  }, [filtersWrapperRef]);

  if (!summit || schedules.length === 0 ) return null;

  const scheduleState = schedules.find( s => s.key === schedKey);
  const { events, allEvents, filters, view, timezone, colorSource } = scheduleState || {};

  // if we don't have a state, it probably means the schedule was disabled from admin.
  if (!scheduleState) {
    return <NotFoundPage />;
  }

  const filterProps = {
    summit,
    events,
    allEvents,
    filters: pickBy(filters, (value) => value.enabled),
    triggerAction: (action, payload) => {
      updateFilter(schedKey, payload);
    },
    marketingSettings: colorSettings,
    colorSource,
  };

  let schedProps = {
    summit,
    events,
    filters,
    view,
    timezone,
    colorSource,
    schedKey,
    ...scheduleProps
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    schedProps = {
      ...schedProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`, { state: { previousUrl: location.pathname }}),
      onStartChat: null,
    };
  }

  return (
    <Layout location={location}>
      <div className="container">
        <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ""}`}>
          <div className={styles.scheduleWrapper}>
            <FullSchedule {...schedProps} />
          </div>
          <div ref={filtersWrapperRef} className={styles.filterWrapper}>
            <ScheduleFilters {...filterProps} />
          </div>
          <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)} />
        </div>
      </div>
      <AttendanceTrackerComponent />
      <AccessTracker />
      <PageScrollInspector scrollDirectionChanged={onScrollDirectionChange} bottomReached={onPageBottomReached} />
    </Layout>
  );
};

SchedulePage.propTypes = {
  schedKey: PropTypes.string.isRequired,
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({ summitState, clockState, loggedUserState, allSchedulesState, settingState }) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  schedules: allSchedulesState.schedules,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
  reloadScheduleData,
})(SchedulePage);