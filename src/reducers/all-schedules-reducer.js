import scheduleReducer from './schedule-reducer';
import summitData from '../content/summit.json';
import eventsData from '../content/events.json';
import {filterEventsByTags} from '../utils/schedule';
import {LOGOUT_USER} from "openstack-uicore-foundation/lib/actions";
import {UPDATE_FILTER, UPDATE_FILTERS, CHANGE_VIEW, CHANGE_TIMEZONE} from '../actions/schedule-actions'
import {RESET_STATE, SYNC_DATA} from '../actions/base-actions';
import {GET_EVENT_DATA} from '../actions/event-actions';

const scheduleEvents = filterEventsByTags(eventsData);

const DEFAULT_STATE = {
    allEvents: eventsData,
    allScheduleEvents: scheduleEvents,
    schedules: []
};

const allSchedulesReducer = (state = DEFAULT_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case RESET_STATE:
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case SYNC_DATA: {
            const {allScheduleEvents} = DEFAULT_STATE;

            const schedules = summitData.schedule_settings.map(sched => {
                const {key, filters, ...rest} = sched;
                const schedInitialState = {allEvents: allScheduleEvents, baseFilters: filters, ...rest};
                const schedReducer = scheduleReducer(key);
                const schedState = schedReducer(schedInitialState, `${action}_${key}`);
                return {key, reducer: schedReducer, state: schedState};
            });

            return {...DEFAULT_STATE, schedules};
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
        case CHANGE_TIMEZONE:
        case CHANGE_VIEW:
        case UPDATE_FILTERS:
        case UPDATE_FILTER: {
            const {key} = payload;
            const {schedules} = state;
            const schedule = schedules.find(s => s.key === key);
            schedule.state = schedule.reducer(schedule.state, `${action}_${key}`);
            return {...state, schedules};
        }
        default:
            return state;
    }
};

export default allSchedulesReducer
