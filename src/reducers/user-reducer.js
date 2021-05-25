import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import {
  GET_DISQUS_SSO,
  GET_ROCKETCHAT_SSO,
  GET_USER_PROFILE,
  START_LOADING_PROFILE,
  STOP_LOADING_PROFILE,
  GET_IDP_PROFILE,
  SET_AUTHORIZED_USER,
  SET_USER_TICKET,
  START_LOADING_IDP_PROFILE,
  STOP_LOADING_IDP_PROFILE,
  ADD_TO_SCHEDULE,
  REMOVE_FROM_SCHEDULE
} from '../actions/user-actions'

const DEFAULT_STATE = {
  loading: false,
  loadingIDP: false,
  disqusSSO: {},
  rocketChatSSO: {},
  userProfile: null,
  idpProfile: null,
  isAuthorized: null,
  hasTicket: null
}

const userReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING_PROFILE:
      return { ...state, loading: true };
    case STOP_LOADING_PROFILE:
      return { ...state, loading: false };
    case START_LOADING_IDP_PROFILE:
      return { ...state, loadingIDP: true };
    case STOP_LOADING_IDP_PROFILE:
      return { ...state, loadingIDP: false };
    case GET_USER_PROFILE:
      return { ...state, userProfile: payload.response }
    case SET_AUTHORIZED_USER:
      return { ...state, isAuthorized: payload }
    case SET_USER_TICKET:
      return { ...state, hasTicket: payload }
    case GET_IDP_PROFILE:
      return { ...state, idpProfile: payload.response }
    case ADD_TO_SCHEDULE: {      
      return { ...state, userProfile: { ...state.userProfile, schedule_summit_events: [...state.userProfile.schedule_summit_events, payload] } }
    }
    case REMOVE_FROM_SCHEDULE: {      
      return { ...state, userProfile: { ...state.userProfile, schedule_summit_events: [...state.userProfile.schedule_summit_events.filter(ev => ev.id !== payload.id)] } }
    }
    case GET_DISQUS_SSO:
      const disqus = payload.response;
      return { ...state, loading: false, disqusSSO: disqus };
    case GET_ROCKETCHAT_SSO:
      const rocket = payload.response;
      return { ...state, loading: false, rocketChatSSO: rocket };
    default:
      return state;
  }
}

export default userReducer
