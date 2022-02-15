import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { GET_POSTER_DETAILS, GET_POSTER_DETAILS_ERROR } from '../actions/poster-actions'
import {RESET_STATE, SYNC_DATA} from "../actions/base-actions";

const DEFAULT_STATE = {
  loading: false,
  poster: null,
};

const posterReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case RESET_STATE:
    case LOGOUT_USER:
    case SYNC_DATA:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    case GET_POSTER_DETAILS:
      const poster = payload.response || payload.poster;      
      return { ...state, loading: false, poster: poster };
    case GET_POSTER_DETAILS_ERROR: {
      return { ...state, loading: false, poster: null }
    }
    default:
      return state;
  }
};

export default posterReducer;