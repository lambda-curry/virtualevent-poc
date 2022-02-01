import summitData from '../content/summit.json';
import {syncFilters} from "../utils/filterUtils";
import {getFilteredEvents, preFilterEvents} from '../utils/schedule';
import {LOGOUT_USER} from "openstack-uicore-foundation/lib/actions";
import {RESET_STATE} from '../actions/base-actions';

const summitTimeZoneId = summitData.summit.time_zone_id;  // TODO use reducer data

/*const INITIAL_STATE = {
    filters: filters,
    colorSource: color_source,
    events: filterEventsByTags(eventsData),
    view: 'calendar',
    timezone: 'show'
};*/

const INITIAL_STATE = {
    events: [],
    filters: [],
}

const scheduleReducer = (key) => (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case RESET_STATE:
        case LOGOUT_USER:
            return INITIAL_STATE;
        case `SYNC_DATA_${key}`: {
            const {color_source, baseFilters, pre_filters, allEvents, filters } = state;

            console.log('ALL EVENTS SCHED', allEvents);

            // new filter could have new keys, or less keys that current one .... so its the source of truth
            const allFilteredEvents = preFilterEvents(allEvents, pre_filters, summitTimeZoneId);
            const newFilters = syncFilters(baseFilters, filters);
            const events = getFilteredEvents(allFilteredEvents, newFilters, summitTimeZoneId);
            return {...state, allEvents: allFilteredEvents, filters: newFilters, colorSource: color_source, events};
        }
        case `UPDATE_FILTER_${key}`: {
            const {type, values} = payload;
            const {filters, allEvents} = state;
            filters[type].values = values;

            // update events
            const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

            return {...state, filters, events}
        }
        case `UPDATE_FILTERS_${key}`: {
            const {filters, view} = payload;
            const {allEvents} = state;

            // update events
            const events = getFilteredEvents(allEvents, filters, summitTimeZoneId);

            return {...state, filters, events, view}
        }
        case `CHANGE_VIEW_${key}`: {
            const {view} = payload;
            return {...state, view}
        }
        case `CHANGE_TIMEZONE_${key}`: {
            const {timezone} = payload;
            return {...state, timezone}
        }
        default:
            return state;
    }
};

export default scheduleReducer
