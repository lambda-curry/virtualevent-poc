import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { RECEIVE_EVENTS, UPDATE_CLOCK } from '../actions/schedule-actions'

import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

import { sortEvents } from '../utils/schedule'

const DEFAULT_STATE = {
  loading: false,
  schedule: null,
  now: null,
}

const scheduleReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    case UPDATE_CLOCK: {
      const { timestamp } = payload;
      return { ...state, now: timestamp };
    }
    case RECEIVE_EVENTS: {      
      let events = [...payload.response.data];
      return { ...state, schedule: events };
    }
    default:
      return state;
  }
}

export default scheduleReducer
