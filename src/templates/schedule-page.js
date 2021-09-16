import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import { pickBy } from "lodash";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import { updateFiltersFromHash, updateFilter, getShareLink } from "../actions/schedule-actions";
import Layout from "../components/Layout";
import FullSchedule from "../components/FullSchedule";
import ScheduleFilters from "../components/ScheduleFilters";
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import { PHASES } from "../utils/phasesUtils";
import FilterButton from "../components/FilterButton";

import styles from "../styles/full-schedule.module.scss";


const SchedulePage = ({
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
  const [showFilters, setShowfilters] = useState(false);

  // @see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  // @see https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function

  /*
    @see https://reactjs.org/docs/hooks-reference.html#useref
    .current property is initialized to the passed argument (initialValue).
    The returned object will persist for the full lifetime of the component.
    so i pass view or filter as initial value , .current will not mutate it will keep
    the first time render value, and when property change will keep the initial value
    so i must explicitly mutate it
   */
  const viewRef = useRef(null)
  viewRef.current = view;
  const filterRef = useRef(null);
  filterRef.current = filters;

  const filterProps = {
    summit,
    events,
    allEvents,
    filters: pickBy(filters, (value) => value.enabled),
    triggerAction: (action, payload) => {
      updateFilter(payload);
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
    /*  use instance variables otherwise will get stale prop values at callback triggering
        Any function inside a component, including event handlers and effects, “sees” the props
        and state from the render it was created in
     */
    getShareLink: _ => getShareLink(filterRef.current, viewRef.current ),
  };

  if (isLoggedUser && summitPhase !== PHASES.BEFORE) {
    scheduleProps = {
      ...scheduleProps,
      onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      onStartChat: console.log,
    };
  }

  useEffect(() => {
    updateFiltersFromHash(filters);
  });

  if (!summit) return null;

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
    </Layout>
  );
};

SchedulePage.propTypes = {
  summitPhase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
};

const mapStateToProps = ({
  summitState,
  clockState,
  loggedUserState,
  scheduleState,
  settingState,
}) => ({
  summit: summitState.summit,
  summitPhase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  events: scheduleState.events,
  allEvents: scheduleState.allEvents,
  filters: scheduleState.filters,
  view: scheduleState.view,
  colorSource: scheduleState.colorSource,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  updateFiltersFromHash,
  updateFilter,
})(SchedulePage);
