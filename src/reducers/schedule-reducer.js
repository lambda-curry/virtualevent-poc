import summitData from '../content/summit.json';
import eventsData from '../content/events.json';
import filtersData from '../content/filters.json';
import {syncFilters} from "../utils/filterUtils";
import {getFilteredEvents, filterEventsByTags} from '../utils/schedule';
import {LOGOUT_USER} from "openstack-uicore-foundation/lib/actions";
import {UPDATE_FILTER, UPDATE_FILTERS, CHANGE_VIEW} from '../actions/schedule-actions'
import {RESET_STATE, SYNC_DATA} from '../actions/base-actions';
import {GET_EVENT_DATA} from '../actions/event-actions';

const {color_source, ...filters} = filtersData;

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

const DEFAULT_STATE = {
    filters: filters,
    colorSource: color_source,
    allEvents: eventsData,
    allScheduleEvents: filterEventsByTags(eventsData),
    events: filterEventsByTags(eventsData),
    view: 'calendar',
    timezone: 'show'
};

const scheduleReducer = (state = DEFAULT_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case RESET_STATE:
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case SYNC_DATA: {
            const {filters: currentFilters} = state;
            // new filter could have new keys, or less keys that current one .... so its the source of truth
            const newFilters = syncFilters({...filters}, currentFilters);
            const allScheduleEvents = filterEventsByTags(eventsData);
            const events = getFilteredEvents(allScheduleEvents, newFilters, summitTimeZoneId);
            return {...state, allEvents: eventsData, filters: newFilters, colorSource: color_source, events, allScheduleEvents};
        }
        case GET_EVENT_DATA: {
            const {allEvents} = state;
            // check first if we have api response
            const event = payload.response || payload.event;
            const index = state.allEvents.findIndex((e) => e.id === event.id);
            const updatedEvents = [...allEvents];

            if (index >= 0) {
                // update the event on reducer
                updatedEvents[index] = {...event};
            } else {
                // add the event to reducer
                updatedEvents.push(event);
            }
            return {...state, allEvents: updatedEvents};
        }
        case UPDATE_FILTER: {
            const {type, values} = payload;
            const {filters, allScheduleEvents} = state;
            filters[type].values = values;

            // update events
            const events = getFilteredEvents(allScheduleEvents, filters, summitTimeZoneId);

            return {...state, filters, events}
        }
        case UPDATE_FILTERS: {
            const {filters, view} = payload;
            const {allScheduleEvents} = state;

            // update events
            const events = getFilteredEvents(allScheduleEvents, filters, summitTimeZoneId);

            return {...state, filters, events, view}
        }
        case CHANGE_VIEW: {
            const {view} = payload;
            return {...state, view}
        }
        case CHANGE_TIMEZONE: {
            const {timezone} = payload;
            return {...state, timezone}
        }
        default:
            return state;
    }
};

export default scheduleReducer
