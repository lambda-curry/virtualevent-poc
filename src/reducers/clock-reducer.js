import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import {
  UPDATE_CLOCK,
  SUMMIT_PHASE_AFTER,
  SUMMIT_PHASE_DURING,
  SUMMIT_PHASE_BEFORE,
  EVENT_PHASE_AFTER,
  EVENT_PHASE_DURING,
  EVENT_PHASE_BEFORE,
  EVENT_PHASE_ADD
} from '../actions/clock-actions';

import {RESET_STATE, SYNC_DATA} from "../actions/base-actions";

const DEFAULT_STATE = {
  loading: false,
  nowUtc: null,
  summit_phase: null,
  events_phases: [],
};

const clockReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_STATE:
    case LOGOUT_USER:
    case SYNC_DATA:
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
      return { ...state, summit_phase: payload };
    }
    case SUMMIT_PHASE_DURING: {
      return { ...state, summit_phase: payload };
    }
    case SUMMIT_PHASE_BEFORE: {
      return { ...state, summit_phase: payload };
    }
    case EVENT_PHASE_ADD: {
      return { ...state, events_phases: [...state.events_phases, payload] };
    }
    case EVENT_PHASE_AFTER: {
      let eventsPhases = [...new Set(state.events_phases.filter(s => s.id !== payload.id))];
      return { ...state, events_phases: [...eventsPhases, payload] };
    }
    case EVENT_PHASE_DURING: {
      let eventsPhases = [...new Set(state.events_phases.filter(s => s.id !== payload.id))];
      return { ...state, events_phases: [...eventsPhases, payload] };
    }
    case EVENT_PHASE_BEFORE: {
      let eventsPhases = [...new Set(state.events_phases.filter(s => s.id !== payload.id))];
      return { ...state, events_phases: [...eventsPhases, payload] };
    }
    default:
      return state;
  }
};

export default clockReducer;
