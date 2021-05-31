import EventObject from '../content/events.json';

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { CHECK_EVENTS, GET_EVENT_DATA, GET_EVENT_DATA_ERROR } from '../actions/event-actions'

const DEFAULT_STATE = {
  loading: false,
  event: null,
  allEvents: EventObject.events,
  buildTime: EventObject.build_time
}

const eventReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    case CHECK_EVENTS: {
      const { build_time, events } = EventObject
      if (state.buildTime < build_time) {
        return { ...state, allEvents: events, buildTime: build_time }
      } else {
        return { ...state }
      }
    }
    case GET_EVENT_DATA:
      const event = payload.response || payload.event;
      return { ...state, loading: false, event: event };
    case GET_EVENT_DATA_ERROR: {
      return { ...state, loading: false, event: null }
    }
    default:
      return state;
  }
}

export default eventReducer
