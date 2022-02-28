import {
  getAccessToken,
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

import { VotingPeriod } from '../model/VotingPeriod';

import { getVotingPeriodPhase } from '../utils/phasesUtils';
import { mapVotesPerTrackGroup } from '../utils/voting-utils';

import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

export const SET_INITIAL_DATASET = 'VOTEABLE_PRESENTATIONS_SET_INITIAL_DATASET';
export const GET_VOTEABLE_PRESENTATIONS = 'GET_VOTEABLE_PRESENTATIONS';
export const PRESENTATIONS_PAGE_REQUEST = 'PRESENTATIONS_PAGE_REQUEST';
export const PRESENTATIONS_PAGE_RESPONSE = 'PRESENTATIONS_PAGE_RESPONSE';
export const VOTEABLE_PRESENTATIONS_UPDATE_FILTER = 'VOTEABLE_PRESENTATIONS_UPDATE_FILTER';
export const GET_PRESENTATION_DETAILS = 'GET_PRESENTATION_DETAILS';
export const GET_PRESENTATION_DETAILS_ERROR = 'GET_PRESENTATION_DETAILS_ERROR';
export const GET_RECOMMENDED_PRESENTATIONS = 'GET_RECOMMENDED_PRESENTATIONS';
export const VOTING_PERIOD_ADD = 'VOTING_PERIOD_ADD';
export const VOTING_PERIOD_PHASE_CHANGE = 'VOTING_PERIOD_PHASE_CHANGE';

export const setInitialDataSet = () => (dispatch, getState) => Promise.resolve().then(() => {
  const { userState: { userProfile } } = getState();
  dispatch(createAction(SET_INITIAL_DATASET)({ userProfile }));
  return dispatch(createVotingPeriods());
});

export const updateFilter = (filter) => (dispatch) => {
  dispatch(createAction(VOTEABLE_PRESENTATIONS_UPDATE_FILTER)({ ...filter }));
};

export const getAllVoteablePresentations = (page = 1, perPage = 10) => async (dispatch) => {

  dispatch(startLoading());

  let accessToken;
  try {
      accessToken = await getAccessToken();
  } catch (e) {
      console.log('getAccessToken error: ', e);
      dispatch(stopLoading());
      return Promise.reject();    
  }

  const params = {
    access_token: accessToken,
    filter: 'published==1',
    relations: 'none',
    fields: 'id',
    page: page,
    per_page: perPage,
  };

  return getRequest(
    null,
    createAction(GET_VOTEABLE_PRESENTATIONS), // response needs no handling
    `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/voteable`,
    customErrorHandler
  )(params)(dispatch).then((payload) => {
    const { response: { last_page } } = payload;
    const allPages = Array.from({ length: last_page}, (_, i) => i + 1);
    const dispatchCalls = allPages.map(p => dispatch(getVoteablePresentations(p, perPage)));
    Promise.all([...dispatchCalls]).then(() => {
      dispatch(stopLoading());
    });
  }).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}

export const getVoteablePresentations = (page = 1, perPage = 10) => async (dispatch, getState) => {

  let accessToken;
  try {
      accessToken = await getAccessToken();
  } catch (e) {
      console.log('getAccessToken error: ', e);
      return Promise.reject();    
  }

  const params = {
    access_token: accessToken,
    expand: 'track,media_uploads,speakers,tags',
    filter: 'published==1',
    page: page,
    per_page: perPage,
  };

  return getRequest(
    createAction(PRESENTATIONS_PAGE_REQUEST),
    createAction(PRESENTATIONS_PAGE_RESPONSE),
    `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/voteable`,
    customErrorHandler,
    { page }
  )(params)(dispatch).catch(e => {
    return (e);
  });
};

export const getPresentationById = (presentationId) => async (dispatch, getState) => {

  dispatch(startLoading());

  let accessToken;
  try {
      accessToken = await getAccessToken();
  } catch (e) {
      console.log('getAccessToken error: ', e);
      dispatch(stopLoading());
      return Promise.reject();    
  }

  const params = {
      access_token: accessToken,
      expand: 'speakers,media_uploads,media_uploads.media_upload_type,track,slides,videos,links,track.allowed_access_levels'
  };

  return getRequest(
      null,
      createAction(GET_PRESENTATION_DETAILS),
      `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/presentations/voteable/${presentationId}`,
      customErrorHandler
  )(params)(dispatch).then((presentation) => {
      dispatch(getRecommendedPresentations(presentation.response.track.track_groups));
  }).catch(e => {
      dispatch(stopLoading());
      dispatch(createAction(GET_PRESENTATION_DETAILS_ERROR)(e));
      return (e);
  });
};

export const getRecommendedPresentations = (trackGroups) => async (dispatch, getState) => {

  dispatch(startLoading());

  let accessToken;
  try {
      accessToken = await getAccessToken();
  } catch (e) {
      console.log('getAccessToken error: ', e);
      dispatch(stopLoading());
      return Promise.reject();    
  }

// order by random

  const filter = [`track_group_id==${trackGroups.map((e, index) => `${e}${index+1===trackGroups.length?'':','}`)}`, 'published==1'];

  const params = {
      access_token: accessToken,
      expand: 'speakers, media_uploads, track',
      'filter[]': filter,
      order: 'random',
  };

  return getRequest(
      null,
      createAction(GET_RECOMMENDED_PRESENTATIONS),
      `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/presentations/voteable`,
      customErrorHandler
  )(params)(dispatch).then(() => {
      dispatch(stopLoading());
  }).catch(e => {
      dispatch(stopLoading());
      return (e);
  });
};

export const updateVotingPeriodsPhase = () => (dispatch, getState) => {
  const { clockState: { nowUtc }, presentationsState: { votingPeriods } } = getState();
  if (Object.keys(votingPeriods).length) {
    Object.entries(votingPeriods).forEach(entry => {
      const [trackGroupId, votingPeriod] = entry;
      const newPhase = getVotingPeriodPhase(votingPeriod, nowUtc);
      if (newPhase !== votingPeriod.phase) {
        dispatch(createAction(VOTING_PERIOD_PHASE_CHANGE)({ trackGroupId, phase: newPhase }));
      }
    });
  }
};

export const createVotingPeriods = () => (dispatch, getState) => {
  const { clockState: { nowUtc },
          userState: { attendee },
          summitState: { summit: { track_groups: trackGroups } },
          presentationsState: { voteablePresentations: { ssrPresentations: allBuildTimePresentations } } } = getState();

  const votesPerTrackGroup = mapVotesPerTrackGroup(attendee?.presentation_votes ?? [], allBuildTimePresentations);

  trackGroups.forEach(trackGroup => {
    const { name, begin_attendee_voting_period_date: startDate,
            end_attendee_voting_period_date: endDate,
            max_attendee_votes: maxAttendeeVotes } = trackGroup;
    const votingPeriod = VotingPeriod({ name, startDate, endDate, maxAttendeeVotes }, nowUtc);
    if (votesPerTrackGroup[trackGroup.id]) votingPeriod.addVotes = votesPerTrackGroup[trackGroup.id];
    dispatch(createAction(VOTING_PERIOD_ADD)({ trackGroupId: trackGroup.id, votingPeriod }));
  });
};