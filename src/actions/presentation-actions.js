import {
  getAccessToken,
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

export const REQUEST_PRESENTATIONS_PAGE = 'REQUEST_PRESENTATIONS_PAGE';
export const RECEIVE_PRESENTATIONS_PAGE = 'RECEIVE_PRESENTATIONS_PAGE';
export const REQUEST_PRESENTATIONS_PAGE_ERROR = 'REQUEST_PRESENTATIONS_PAGE_ERROR';
export const VOTEABLE_PRESENTATIONS_UPDATE_FILTER = 'VOTEABLE_PRESENTATIONS_UPDATE_FILTER';
export const GET_PRESENTATION_DETAILS = 'GET_PRESENTATION_DETAILS';
export const GET_PRESENTATION_DETAILS_ERROR = 'GET_PRESENTATION_DETAILS_ERROR';
export const GET_RECOMMENDED_PRESENTATIONS = 'GET_RECOMMENDED_PRESENTATIONS';


export const updateFilter = (filter, action = VOTEABLE_PRESENTATIONS_UPDATE_FILTER) => (dispatch) => {
  dispatch(createAction(action)({...filter}));
};

export const getVoteablePresentations = (page = 1, perPage = 9) => async (dispatch, getState) => {

  dispatch(startLoading());

  const accessToken = await getAccessToken();
  if (!accessToken) {
    dispatch(stopLoading());
    return Promise.resolve();
  }

  const params = {
    access_token: accessToken,
    expand: 'track, media_uploads',
    filter: 'published==1',
    order: 'page_random',
    page: page,
    per_page: perPage,
  };

  return getRequest(
    createAction(REQUEST_PRESENTATIONS_PAGE),
    createAction(RECEIVE_PRESENTATIONS_PAGE),
    `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/voteable`,
    customErrorHandler,
    { page }
  )(params)(dispatch).then((result) => {
    const { presentationsState: { pagination: { pages, lastPage } } } = getState();
    const fetchedPages = Object.keys(pages).map(Number);
    const allPages = Array.from({ length: lastPage }, (_, i) => i + 1);
    const remainingPages = allPages.filter(x => !fetchedPages.includes(x));
    if (remainingPages.length) {
      const randomRemainingPageIndex = Math.floor(Math.random() * remainingPages.length);
      dispatch(getVoteablePresentations(remainingPages[randomRemainingPageIndex], perPage));
    } else {
      dispatch(stopLoading());
    }
  }).catch(e => {
    dispatch(stopLoading());
    dispatch(createAction(REQUEST_PRESENTATIONS_PAGE_ERROR)(e));
    return (e);
  });
};

export const getPresentationById = (presentationId) => async (dispatch, getState) => {

  dispatch(startLoading());

  let accessToken;

  try {
      accessToken = await getAccessToken();
  } catch (e) {
      console.log('error: ', e)
      dispatch(stopLoading());
      return Promise.reject();    
  }

  let params = {
      access_token: accessToken,
      expand: 'speakers, media_uploads, track'
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
      console.log('error: ', e)
      dispatch(stopLoading());
      return Promise.reject();    
  }

// order by random

  const filter = [`track_group_id==${trackGroups.map((e, index) => `${e}${index+1===trackGroups.length?'':','}`)}`, 'published==1'];

  let params = {
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