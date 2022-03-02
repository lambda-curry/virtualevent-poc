import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import { updateFiltersFromHash, updateFilter } from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import AccessTracker from "../components/AttendeeToAttendeeWidgetComponent";
import { PHASES } from "../utils/phasesUtils";
import FilterButton from "../components/FilterButton";
import {syncData} from "../actions/base-actions";
import styles from "../styles/full-schedule.module.scss";
import NotFoundPage from "../pages/404";

const SCROLL_DIRECTION = {
  UP: 'scrolling up',
  DOWN: 'scrolling down'
};

const SchedulePage = ({summit, schedules, summitPhase, isLoggedUser, location, colorSettings, updateFilter, updateFiltersFromHash, scheduleProps, schedKey, syncData }) => {
  const [showFilters, setShowfilters] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [mustScrollFiltersDown, setMustScrollFiltersDown] = useState(false);

  const filtersWrapperRef = useRef(null);

  const scheduleState = schedules.find( s => s.key === schedKey);
  const { events, allEvents, filters, view, timezone, colorSource } = scheduleState || {};

  useEffect(() => {
    updateFiltersFromHash(schedKey, filters, view);
  }, [schedKey, filters, view, updateFiltersFromHash]);

  useEffect(() => {
    if (scrollDirection === SCROLL_DIRECTION.UP) {
      filtersWrapperRef.current.scroll({ top: 0, behavior: 'smooth' });
    }
    const threshold = 420;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDirection(scrollY > lastScrollY ? SCROLL_DIRECTION.DOWN : SCROLL_DIRECTION.UP);
      if (Math.abs(document.body.scrollHeight - document.body.clientHeight - scrollY) < threshold) {
        setMustScrollFiltersDown(true);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection]);

  useEffect(() => {
    if (mustScrollFiltersDown) {
      filtersWrapperRef.current.scroll({ top: filtersWrapperRef.current.scrollHeight, behavior: 'smooth' });
      setMustScrollFiltersDown(false);
    }
  }, [mustScrollFiltersDown]);

  useEffect(() =>{
    syncData();
  }, [])

  if (!summit || schedules.length === 0) return null;

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
  syncData,
})(SchedulePage);