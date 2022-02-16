import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import {
  GET_DISQUS_SSO,
  GET_ROCKETCHAT_SSO,
  GET_USER_PROFILE,
  START_LOADING_PROFILE,
  STOP_LOADING_PROFILE,
  GET_IDP_PROFILE,
  SET_USER_TICKET,
  START_LOADING_IDP_PROFILE,
  STOP_LOADING_IDP_PROFILE,
  ADD_TO_SCHEDULE,
  REMOVE_FROM_SCHEDULE,
  SCHEDULE_SYNC_LINK_RECEIVED,
  SET_USER_ORDER,
  CAST_PRESENTATION_VOTE_RESPONSE,
  UNCAST_PRESENTATION_VOTE_RESPONSE,
  TOGGLE_PRESENTATION_VOTE,
} from '../actions/user-actions';

import { RESET_STATE } from '../actions/base-actions';

import { isAuthorizedUser } from '../utils/authorizedGroups';

const DEFAULT_STATE = {
  loading: false,
  loadingIDP: false,
  disqusSSO: {},
  rocketChatSSO: {},
  userProfile: null,
  idpProfile: null,
  isAuthorized: false,
  hasTicket: false,
  attendee: null
}

const userReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case RESET_STATE:
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
      const { response: userProfile } = payload;
      return { ...state,
                userProfile: userProfile,
                isAuthorized: isAuthorizedUser(userProfile.groups),
                hasTicket: userProfile.summit_tickets?.length > 0
             }
    // is this action type used?
    case SET_USER_TICKET:
      return { ...state, hasTicket: payload }
    case SET_USER_ORDER: {
      const { tickets } = payload;
      return {...state, hasTicket: true, userProfile: {...state.userProfile, summit_tickets: [...tickets] }};
    }
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
    case SCHEDULE_SYNC_LINK_RECEIVED:
      const {link} = payload.response;
      return { ...state, userProfile: {...state.userProfile, schedule_shareable_link: link} };
    default:
      return state;
  }
};

const attendeeReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_PROFILE:
      const { summit_tickets: [ticket] } = payload.response;
      return { ...state, attendee: ticket?.owner ?? null };
    case SET_USER_ORDER: {
      const { tickets: [ticket] } = payload;
      return { ...state, attendee: ticket?.owner ?? null };
    }
    case CAST_PRESENTATION_VOTE_RESPONSE: {
      const { attendee: { presentation_votes }} = state;
      const { response: vote } = payload;
      return { ...state, attendee: { ...state.attendee, presentation_votes: [...presentation_votes, vote] } };
    }
    case UNCAST_PRESENTATION_VOTE_RESPONSE: {
      const { attendee: { presentation_votes }} = state;
      const { presentation } = payload;
      const newVotes = [...presentation_votes.filter(vote => vote.presentation_id !== presentation.id)];
      return { ...state, attendee: { ...state.attendee, presentation_votes: newVotes } };
    }
    case TOGGLE_PRESENTATION_VOTE: {
      const { attendee: { presentation_votes }} = state;
      const { presentation, isVoted } = payload;
      let newVotes;
      if (isVoted) {
        // we had tried casting vote and vote already existed in api
        // we add it as a local vote
        const localVote = { presentation_id: presentation.id };
        newVotes = [...presentation_votes, localVote];
      } else {
        // we had tried uncasting vote and vote did not exist in api
        // we remove local vote
        newVotes = [...presentation_votes.filter(vote => vote.presentation_id !== presentation.id)];
      }
      return { ...state, attendee: { ...state.attendee, presentation_votes: newVotes } };
    }
    default:
      return state;
  }
};

const reduceReducers = (...reducers) => (state, action) =>
    reducers.reduce((acc, r) => r(acc, action), state);

export default reduceReducers(attendeeReducer, userReducer);
