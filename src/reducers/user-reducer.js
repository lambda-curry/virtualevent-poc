import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_DISQUS_SSO, GET_ROCKETCHAT_SSO } from '../actions/user-actions'

const DEFAULT_STATE = {
  loading: false,
  disqusSSO: {},
  rocketChatSSO: {},
}

const userReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };      
    case STOP_LOADING:
      return { ...state, loading: false };      
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
