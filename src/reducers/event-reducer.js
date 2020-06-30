import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_EVENT_DATA } from '../actions/event-actions'

const DEFAULT_STATE = {
  loading: false,
  event: {},
}

const eventReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
      break;
    case STOP_LOADING:
      return { ...state, loading: false };
      break;
    case GET_EVENT_DATA:
      const event = payload.response;
      return { ...state, loading: false, event: event };
      break;
    default:
      return state;
      break;
  }
}

export default eventReducer
