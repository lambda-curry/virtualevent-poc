import {createAction} from 'openstack-uicore-foundation/lib/methods';
import { FragmentParser } from "openstack-uicore-foundation/lib/components";

import {pickBy, isEqual, isEmpty} from "lodash";

export const UPDATE_FILTER      = 'UPDATE_FILTER';
export const UPDATE_FILTERS     = 'UPDATE_FILTERS';
export const CHANGE_VIEW        = 'CHANGE_VIEW';
export const CHANGE_TIMEZONE    = 'CHANGE_TIMEZONE';

export const MY_SCHEDULE_UPDATE_FILTER      = 'MY_SCHEDULE_UPDATE_FILTER';
export const MY_SCHEDULE_UPDATE_FILTERS     = 'MY_SCHEDULE_UPDATE_FILTERS';

const fragmentParser = new FragmentParser();

export const updateFilter = (key, filter, action = UPDATE_FILTER) => (dispatch) => {
    dispatch(createAction(action)({...filter, key}))
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

    Object.entries(filters).forEach(([key, value]) => {
        if(value.values.length > 0) {
            const hashValue = Array.isArray(value.values) ? value.values.join(',') : value.values;
            hashVars.push(`${key}=${hashValue}`)
        }
    });

    hashVars.push(`view=${view}`);

    if (typeof window !== 'undefined') {
        return `${window.location}#${hashVars.join('&')}`;
    }

    return '';
};

export const callAction = (key, action, payload) => (dispatch) => {
    return dispatch(createAction(action)({...payload, key}));
};