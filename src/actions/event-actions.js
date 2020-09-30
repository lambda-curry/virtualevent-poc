import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,  
} from 'openstack-uicore-foundation/lib/methods';

// import Swal from 'sweetalert2';

import { customErrorHandler } from '../utils/customErrorHandler';

import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

export const GET_EVENT_DATA         = 'GET_EVENT_DATA';
export const GET_EVENT_DATA_ERROR   = 'GET_EVENT_DATA_ERROR';

export const handleResetReducers = () => (dispatch, getState) => {
  dispatch(createAction(LOGOUT_USER)({}));
}

export const getEventById = (eventId) => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  if (!accessToken) return Promise.resolve();

  let params = {
      access_token: accessToken,      
      expand: 'type,track,location,location.venue,location.floor,speakers,moderator,sponsors'
  };

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_EVENT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/events/${eventId}/published`,
    customErrorHandler
  )(params)(dispatch).then(() => {
    dispatch(stopLoading());
  }).catch(e => {
    dispatch(stopLoading());
    dispatch(createAction(GET_EVENT_DATA_ERROR)({}))
    return (e);
  });
}