import summitData from '../content/summit.json';
import {getFilteredEvents, syncFilters} from '../utils/schedule';
import {LOGOUT_USER} from "openstack-uicore-foundation/lib/actions";
import {RESET_STATE} from '../actions/base-actions';

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

const INITIAL_STATE = {
    events: [],
    filters: [],
    view: 'calendar',
    timezone: 'show'
};

const scheduleReducer = (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case RESET_STATE:
        case LOGOUT_USER:
            return INITIAL_STATE;
        case `SCHED_SYNC_DATA`: {
            const {color_source, pre_filters, allEvents, filters} = payload; // data from JSON

            const allFilteredEvents = getFilteredEvents(allEvents, pre_filters, summitTimeZoneId);
            const newFilters = syncFilters(filters, state.filters);
            const events = getFilteredEvents(allFilteredEvents, newFilters, summitTimeZoneId);
            return {...state, allEvents: allFilteredEvents, filters: newFilters, colorSource: color_source, events};
        }
        case `SCHED_UPDATE_FILTER`: {
            const {type, values} = payload;
            const {filters, allEvents} = state;
            filters[type].values = values;

            // update events
            const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

            return {...state, filters, events}
        }
        case `SCHED_UPDATE_FILTERS`: {
            const {filters, view} = payload;
            const {allEvents} = state;

            // update events
            const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

            return {...state, filters, events, view}
        }
        case `SCHED_CHANGE_VIEW`: {
            const {view} = payload;
            return {...state, view}
        }
        case `SCHED_CHANGE_TIMEZONE`: {
            const {timezone} = payload;
            return {...state, timezone}
        }
        default:
            return state;
    }
};

export default scheduleReducer
