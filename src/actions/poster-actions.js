import {
    getAccessToken,
    getRequest,
    createAction,
    stopLoading,
    startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import {customErrorHandler} from '../utils/customErrorHandler';

export const GET_POSTER_DETAILS = 'GET_POSTER_DETAILS';
export const GET_POSTER_DETAILS_ERROR = 'GET_POSTER_DETAILS_ERROR';

export const getPosterById = (posterId) => async (dispatch, getState) => {

    dispatch(startLoading());

    let accessToken;

    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log('error: ', e)
        dispatch(stopLoading());
        return Promise.reject();    
    }

    let params = {
        access_token: accessToken,
        expand: 'speakers, media_uploads'
    };

    return getRequest(
        null,
        createAction(GET_POSTER_DETAILS),
        `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/presentations/voteable/${posterId}`,
        customErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        dispatch(stopLoading());
        dispatch(createAction(GET_POSTER_DETAILS_ERROR)(e));
        return (e);
    });

};