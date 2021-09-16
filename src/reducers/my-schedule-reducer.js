import summitData from '../content/summit.json';
import eventsData from '../content/events.json';
import filtersData from '../content/filters.json';

import {getFilteredEvents} from '../utils/schedule';
import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { MY_SCHEDULE_UPDATE_FILTER, MY_SCHEDULE_UPDATE_FILTERS } from '../actions/schedule-actions'
import { RESET_STATE, SYNC_DATA } from '../actions/base-actions';
import {ADD_TO_SCHEDULE, REMOVE_FROM_SCHEDULE} from "../actions/user-actions";
import {syncFilters} from "../utils/filterUtils";

const {color_source, ...filters} = filtersData;

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

const DEFAULT_STATE = {
  filters: filters,
  colorSource: color_source,
  events: [],
  allEvents: eventsData,
  view: 'calendar',
};

const myScheduleReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload, userProfile } = action;

  // we only run this once, to filter initial state of events
  if (!state.events.length > 0 && userProfile?.schedule_summit_events?.length > 0) {
    state.events = filterMyEvents(userProfile, eventsData);
  }

  switch (type) {
    case RESET_STATE:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case SYNC_DATA: {
      // new filter could have new keys, or less keys that current one .... so its the source of truth
      const {filters: currentFilters} = state;
      const newFilters = syncFilters({...filters}, currentFilters);
      const myEvents = filterMyEvents(userProfile, eventsData);
      const events = getFilteredEvents(myEvents, newFilters, summitTimeZoneId);

      return {...state, allEvents: eventsData, filters: newFilters, colorSource: color_source, events};
    }
    case MY_SCHEDULE_UPDATE_FILTER: {
      const {type, values} = payload;
      const {filters, allEvents} = state;
      filters[type].values = values;

      // update events
      const myEvents = filterMyEvents(userProfile, allEvents);
      const events = getFilteredEvents(myEvents, filters, summitTimeZoneId);

      return {...state, filters, events}
    }
    case MY_SCHEDULE_UPDATE_FILTERS: {
      const {filters, view} = payload;
      const {allEvents} = state;


      // update events
      const myEvents = filterMyEvents(userProfile, allEvents);
      const events = getFilteredEvents(myEvents, filters, summitTimeZoneId);

      return {...state, filters, events, view}
    }
    case REMOVE_FROM_SCHEDULE: {
      return {...state, events: state.events.filter(ev => ev.id !== payload.id)};
    }
    case ADD_TO_SCHEDULE: {
      const {allEvents} = state;
      const event = allEvents.find(ev => ev.id === payload.id);
      return {...state, events: [...state.events, event]};
    }
    default:
      return state;
  }
};

const filterMyEvents = (userProfile, events) => {
  const myEventsIds = userProfile?.schedule_summit_events?.map(ev => ev.id) || [];
  return events.filter(ev =>  myEventsIds.includes(ev.id));
};

export default myScheduleReducer
