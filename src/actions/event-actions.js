import {
    getAccessToken,
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    clearAccessToken,
} from 'openstack-uicore-foundation/lib/methods';

import {customErrorHandler} from '../utils/customErrorHandler';

import {LOGOUT_USER} from "openstack-uicore-foundation/lib/actions";

export const GET_EVENT_DATA = 'GET_EVENT_DATA';
export const GET_EVENT_DATA_ERROR = 'GET_EVENT_DATA_ERROR';

export const handleResetReducers = () => (dispatch) => {
    dispatch(createAction(LOGOUT_USER)({}));
};

export const getEventById = (eventId) => async (dispatch, getState) => {

    dispatch(startLoading());

    // check first the reducer
    let {scheduleState: {allEvents}} = getState();
    const event = allEvents.find(ev => ev.id === parseInt(eventId));

    if (event) {
        dispatch(createAction(GET_EVENT_DATA)({event}));
        dispatch(stopLoading());
        return Promise.resolve();
    }

    // if does not exists get it from api

    let accessToken;
    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log('getAccessToken error: ', e);
        dispatch(stopLoading());
        return Promise.reject();
    }

    let params = {
        access_token: accessToken,
        expand: 'track,location,location.venue,location.floor,speakers,slides,links,videos,media_uploads'
    };

    return getRequest(
        null,
        createAction(GET_EVENT_DATA),
        `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/events/${eventId}/published`,
        customErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        dispatch(stopLoading());
        dispatch(createAction(GET_EVENT_DATA_ERROR)(e));
        console.log('ERROR: ', e);
        clearAccessToken();
        return (e);
    });

};