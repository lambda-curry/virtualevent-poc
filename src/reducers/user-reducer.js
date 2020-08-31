import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_DISQUS_SSO, GET_ROCKETCHAT_SSO, GET_USER_PROFILE, START_LOADING_PROFILE, STOP_LOADING_PROFILE } from '../actions/user-actions'

const DEFAULT_STATE = {
  loading: false,
  disqusSSO: {},
  rocketChatSSO: {},
  userProfile: null,
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
    case GET_USER_PROFILE:
      return { ...state, userProfile: payload.response}
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
