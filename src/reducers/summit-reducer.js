import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_SUMMIT_DATA, UPDATE_CLOCK, TIME_NOW, SUMMIT_PHASE_AFTER, SUMMIT_PHASE_DURING, SUMMIT_PHASE_BEFORE } from '../actions/summit-actions'

const DEFAULT_STATE = {
  loading: false,
  summit: null,
  nowUtc: null,
  summit_phase: null,
}

const summitReducer = (state = DEFAULT_STATE, action) => {
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
      return { ...state, nowUtc: timestamp };
    }
    case SUMMIT_PHASE_AFTER: {
      return { ...state, summit_phase: payload }
    }
    case SUMMIT_PHASE_DURING: {
      return { ...state, summit_phase: payload }
    }
    case SUMMIT_PHASE_BEFORE: {
      return { ...state, summit_phase: payload }
    }
    case GET_SUMMIT_DATA:
      const summit = payload.response;
      return { ...state, loading: false, summit: summit };
    default:
      return state;
  }
}

export default summitReducer
