import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_SUMMIT_DATA } from '../actions/summit-actions'

const DEFAULT_STATE = {
  loading: false,
  summit: {},
}

const summitReducer = (state = DEFAULT_STATE, action) => {
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
    case GET_SUMMIT_DATA:
      const summit = payload.response;
      return { ...state, loading: false, summit: summit };
      break;
    default:
      return state;
      break;
  }
}

export default summitReducer
