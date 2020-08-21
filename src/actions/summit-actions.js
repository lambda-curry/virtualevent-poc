import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import SummitObject from '../content/summit.json';

import { customErrorHandler } from '../utils/customErrorHandler';
import { PHASES, getSummitPhase } from '../utils/phasesUtils';

export const GET_SUMMIT_DATA = 'GET_SUMMIT_DATA';
export const SUMMIT_PHASE_AFTER = 'SUMMIT_PHASE_AFTER'
export const SUMMIT_PHASE_DURING = 'SUMMIT_PHASE_DURING'
export const SUMMIT_PHASE_BEFORE = 'SUMMIT_PHASE_BEFORE'
export const UPDATE_CLOCK = 'UPDATE_CLOCK';
export const GET_TIME_NOW = 'GET_TIME_NOW';
export const TIME_NOW = 'TIME_NOW';

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
    dispatch(createAction(UPDATE_CLOCK)(payload));
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
};

export const updateClock = (timestamp) => (dispatch, getState) => {

  const { summitState: { nowUtc, summit_phase } } = getState();

  if (nowUtc) {
    const phase = getSummitPhase(SummitObject, nowUtc, summit_phase);
    if (summit_phase !== phase) {
      switch (phase) {
        case PHASES.BEFORE:
          dispatch(createAction(SUMMIT_PHASE_BEFORE)(PHASES.BEFORE))
          break;
        case PHASES.DURING:
          dispatch(createAction(SUMMIT_PHASE_DURING)(PHASES.DURING))
          break;
        case PHASES.AFTER:
          dispatch(createAction(SUMMIT_PHASE_AFTER)(PHASES.AFTER))
          break;
        default:
          break;
      }
    }
  }

  dispatch(createAction(UPDATE_CLOCK)({ timestamp }));
};