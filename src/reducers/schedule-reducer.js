import {epochToMomentTimeZone} from 'openstack-uicore-foundation/lib/methods';
import {isString} from 'lodash';
import summitData from '../content/summit.json';
import eventsData from '../content/events.json';
import filtersData from '../content/filters.json';

import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { UPDATE_FILTER, UPDATE_FILTERS, CHANGE_VIEW } from '../actions/schedule-actions'
import { RESET_STATE, SYNC_DATA } from '../actions/base-actions';
import { GET_EVENT_DATA } from '../actions/event-actions';

const {color_source, ...filters} = filtersData;

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

const DEFAULT_STATE = {
  filters: filters,
  colorSource: color_source,
  events: eventsData,
  allEvents: eventsData,
  view: 'calendar'
};

const scheduleReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_STATE:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case SYNC_DATA: {
      const {filters: currentFilters} = state;
      const newFilters = {...filters};

      Object.entries(currentFilters).forEach(([key, value]) => {
        value.enabled = newFilters[key].enabled;
        value.label = newFilters[key].label;
      });

      const events = getFilteredEvents(eventsData, currentFilters, summitTimeZoneId);

      return {...state, allEvents: eventsData, filters: currentFilters, colorSource: color_source, events};
    }
    case GET_EVENT_DATA: {
      const {allEvents} = state;
      const event = payload.response || payload.event;
      const index = state.allEvents.findIndex((e) => e.id === event.id);
      const updatedEvents = [...allEvents];

      if (index > 0) {
        updatedEvents[index] = event;
      } else {
        updatedEvents.push(event);
      }
      return { ...state, allEvents: updatedEvents };
    }
    case UPDATE_FILTER: {
      const {type, values} = payload;
      const {filters, allEvents} = state;
      filters[type].values = values;

      // update events
      const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

      return {...state, filters, events}
    }
    case UPDATE_FILTERS: {
      const {filters, view} = payload;
      const {allEvents} = state;


      // update events
      const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

      return {...state, filters, events, view}
    }
    case CHANGE_VIEW: {
      const {view} = payload;
      return {...state, view}
    }
    default:
      return state;
  }
};

// filters: tracks, dates, levels, speakers, tags, locations

const getFilteredEvents = (events, filters, summitTimezone) => {

  return events.filter(ev => {
    let valid = true;

    if (filters.date?.values.length > 0) {
      const dateString = epochToMomentTimeZone(ev.start_date, summitTimezone).format('YYYY-MM-DD');
      valid = filters.date.values.includes(dateString);
      if (!valid) return false;
    }

    if (filters.level?.values.length > 0) {
      valid = filters.level.values.includes(ev.level);
      if (!valid) return false;
    }

    if (filters.track?.values.length > 0) {
      valid = filters.track.values.includes(ev.track.id);
      if (!valid) return false;
    }

    if (filters.speakers?.values.length > 0) {
      valid = ev.speakers?.some(s => filters.speakers.values.includes(s.id)) || filters.speakers.values.includes(ev.moderator?.id);
      if (!valid) return false;
    }

    if (filters.tags?.values.length > 0) {
      valid = ev.tags?.some(t => filters.tags.values.includes(t.id));
      if (!valid) return false;
    }

    if (filters.venues?.values.length > 0) {
      valid = filters.venues.values.includes(ev.location?.id);
      if (!valid) return false;
    }

    if (filters.track_groups?.values.length > 0) {
      valid = ev.track?.track_groups.some(tg => filters.track_groups.values.includes(tg));
      if (!valid) return false;
    }

    if (filters.event_types?.values.length > 0) {
      valid = filters.event_types.values.includes(ev.type.id);
      if (!valid) return false;
    }

    if (filters.company?.values.length > 0) {
      valid = ev.speakers?.some(s => filters.company.values.includes(s.company)) ||
          filters.company.values.includes(ev.moderator?.company) ||
          ev.sponsors?.some(s => filters.company.values.includes(s.name));

      if (!valid) return false;
    }

    if (filters.title?.values && isString(filters.title.values)) {
      valid = ev.title.toLowerCase().includes(filters.title.values.toLowerCase());
      if (!valid) return false;
    }

    return true;
  });
};

export default scheduleReducer
