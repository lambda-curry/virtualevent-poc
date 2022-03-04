import {createAction} from 'openstack-uicore-foundation/lib/methods';
import { FragmentParser } from "openstack-uicore-foundation/lib/components";

import {pickBy, isEqual, isEmpty} from "lodash";

export const UPDATE_FILTER      = 'UPDATE_FILTER';
export const UPDATE_FILTERS     = 'UPDATE_FILTERS';
export const CHANGE_VIEW        = 'CHANGE_VIEW';
export const CHANGE_TIMEZONE    = 'CHANGE_TIMEZONE';

export const MY_SCHEDULE_UPDATE_FILTER = 'MY_SCHEDULE_UPDATE_FILTER';
export const MY_SCHEDULE_UPDATE_FILTERS = 'MY_SCHEDULE_UPDATE_FILTERS';
/**
 * This action is defined to just reinitialize the allScheduleReducer state
 * (allSchedulesReducer.state.schedules) without trigerring the side effects of
 * SYNC_DATA that reloads all the reducers to its initial state
 * @type {string}
 */
export const RELOAD_SCHED_DATA = 'RELOAD_SCHED_DATA';
/**
 * this action is defined to reload the user schedules after the schedule data is
 * initialized (allSchedulesReducer.state.schedules.length > 0 )
 * @type {string}
 */
export const RELOAD_USER_PROFILE = 'RELOAD_USER_PROFILE';

const fragmentParser = new FragmentParser();

export const updateFilter = (key, filter, action = UPDATE_FILTER) => (dispatch) => {
    dispatch(createAction(action)({...filter, key}))
};

export const reloadScheduleData = () => (dispatch, getState) => {
    const {userState, loggedUserState} = getState();
    const {isLoggedUser} = loggedUserState;
    const {userProfile} = userState;
    dispatch(createAction(RELOAD_SCHED_DATA)({isLoggedUser, userProfile }));
    dispatch(createAction(RELOAD_USER_PROFILE)({isLoggedUser, userProfile }));
};

export const updateFiltersFromHash = (key, filters, view, actionCallback = UPDATE_FILTERS) => (dispatch) => {
    const qsFilters = fragmentParser.getParams();

    // clear hash
    fragmentParser.clearParams();

    if (typeof window !== 'undefined') {
        window.history.replaceState(null, null, ' ');
    }

    // escape if no hash
    if (isEmpty(qsFilters)) return null;

    const filterKeys = Object.keys(filters);
    const newFilters = {};

    // remove any query vars that are not filters
    const normalizedFilters =  pickBy(qsFilters, (value, key) => filterKeys.includes(key));

    // populate state filters with hash values
    Object.keys(filters).forEach(key => {
        newFilters[key] = {...filters[key]}; // copy label and rest of props

        if (key === 'title') {
            newFilters[key].values = normalizedFilters[key] ? decodeURIComponent(normalizedFilters[key]) : '';
        } else {
            const newValues = normalizedFilters[key] ? normalizedFilters[key].split(',') : [];
            newFilters[key].values = newValues.map(val => {
                if (isNaN(val)) return decodeURIComponent(val);
                return parseInt(val);
            })
        }
    });

    // only update if filters have changed
    if (!isEqual(newFilters, filters) || view !== qsFilters.view) {
        dispatch(createAction(actionCallback)({filters: newFilters, view: qsFilters.view, key}));
    }
};

export const getShareLink = (filters, view) => {
    const hashVars = [];

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value.values.length > 0) {
                const hashValue = Array.isArray(value.values) ? value.values.join(',') : value.values;
                hashVars.push(`${key}=${hashValue}`)
            }
        });
    }

    if (view) {
        hashVars.push(`view=${view}`);
    }

    if (typeof window !== 'undefined') {
        return `${window.location}#${hashVars.join('&')}`;
    }

    return '';
};

export const callAction = (key, action, payload) => (dispatch) => {
    return dispatch(createAction(action)({...payload, key}));
};