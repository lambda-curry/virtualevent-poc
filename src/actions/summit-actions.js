import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import SummitObject from '../content/summit.json';

import { customErrorHandler } from '../utils/customErrorHandler';

export const GET_SUMMIT_DATA = 'GET_SUMMIT_DATA';
export const SUMMIT_PHASE_AFTER = 'SUMMIT_PHASE_AFTER'
export const SUMMIT_PHASE_DURING = 'SUMMIT_PHASE_DURING'
export const SUMMIT_PHASE_BEFORE = 'SUMMIT_PHASE_BEFORE'
export const UPDATE_CLOCK = 'UPDATE_CLOCK';
export const GET_TIME_NOW = 'GET_TIME_NOW';
export const TIME_NOW = 'TIME_NOW';

export const getSummitData = () => (dispatch) => {

  dispatch(startLoading());

  return getRequest(
    null,
    createAction(GET_SUMMIT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/public/v1/summits/${window.SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`,
    customErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}