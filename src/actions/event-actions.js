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
export const EVENT_PHASE_BEFORE     = 'EVENT_PHASE_BEFORE'
export const EVENT_PHASE_DURING     = 'EVENT_PHASE_DURING'
export const EVENT_PHASE_AFTER      = 'EVENT_PHASE_AFTER'

export const handleResetReducers = () => (dispatch, getState) => {
  dispatch(createAction(LOGOUT_USER)({}));
}

export const getEventBySlug = (slug) => (dispatch, getState) => {

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_EVENT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/public/v1/summits/${window.SUMMIT_ID}/events/${slug}/published?expand=rsvp_template%2C+type%2C+track%2C+location%2C+location.venue%2C+location.floor%2C+speakers%2C+moderator%2C+sponsors%2C+groups%2C+feedback%2C+summit`,
    customErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    dispatch(createAction(GET_EVENT_DATA_ERROR)({}))
    return (e);
  });
}