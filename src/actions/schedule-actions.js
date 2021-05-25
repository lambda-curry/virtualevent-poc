import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

export const REQUEST_EVENTS = 'REQUEST_EVENTS';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const UPDATE_CLOCK = 'UPDATE_CLOCK';

export const getScheduleEvents = () => (dispatch, getState) => {

  dispatch(startLoading());

  let params = {
    expand: 'rsvp_template,type,track,location,location.venue,location.floor,speakers,moderator,sponsors,groups',
    page: 1,
    per_page: 100,    
    order: '+start_date'
  };

  return getRequest(
    createAction(REQUEST_EVENTS),
    createAction(RECEIVE_EVENTS),
    `${window.SUMMIT_API_BASE_URL}/api/public/v1/summits/${window.SUMMIT_ID}/events/published`,
    customErrorHandler
  )(params)(dispatch).then(() => {
    dispatch(stopLoading());
  }
  );
};