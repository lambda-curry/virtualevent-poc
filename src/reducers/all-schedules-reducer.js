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
            const {summit} = summitData;

            const schedules = summit?.schedules_settings.map(sched => {
                const {key} = sched;
                const scheduleState = state.schedules.find(s => s.key === key);
                const newData = {...sched, allEvents: allScheduleEvents};

                const schedState = scheduleReducer(scheduleState, {type: `SCHED_${type}`, payload: newData});

                return {
                    key,
                    ...schedState
                };

            }) || [];

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

            const newSchedules = schedules.map(sched => {
                if (sched.key === key) {
                    return scheduleReducer(sched, {...action, type: `SCHED_${type}`});
                }
                return sched;
            })

            return {...state, schedules: newSchedules};
        }
        default:
            return state;
    }
};

export default allSchedulesReducer
