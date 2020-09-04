import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { RECEIVE_EVENTS, SET_NEXT_EVENT } from '../actions/schedule-actions'

import { sortEvents } from '../utils/schedule'

const DEFAULT_STATE = {
  loading: false,
  schedule: null,
  nextEvent: null
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
    case RECEIVE_EVENTS: {
      let events = sortEvents([...payload.response.data]);
      return { ...state, schedule: events };
    }
    case SET_NEXT_EVENT: {
      return { ...state, nextEvent: payload }
    }
    default:
      return state;
  }
}

export default scheduleReducer
