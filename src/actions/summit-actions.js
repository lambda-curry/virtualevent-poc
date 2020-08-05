import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

export const GET_SUMMIT_DATA  = 'GET_SUMMIT_DATA';
export const UPDATE_CLOCK     = 'UPDATE_CLOCK';
export const GET_TIME_NOW     = 'GET_TIME_NOW';
export const TIME_NOW         = 'TIME_NOW';

export const getSummitData = () => (dispatch, getState) => {

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_SUMMIT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/public/v1/summits/${window.SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`,
    customErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}

export const getTimeNow = () => (dispatch) => {

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_TIME_NOW),
    `https://timeintervalsince1970.appspot.com/`,
    customErrorHandler
  )({})(dispatch).then((response) => {
    const payload = response.response;
    dispatch(stopLoading());
    dispatch(createAction(TIME_NOW)({ payload }));
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
};

export const updateClock = (timestamp) => (dispatch) => {
  dispatch(createAction(UPDATE_CLOCK)({ timestamp }));
};