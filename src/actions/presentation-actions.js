import {
  getAccessToken,
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

import { SET_USER_ORDER } from "./user-actions";

export const SET_INITIAL_DATASET = 'VOTEABLE_PRESENTATIONS_SET_INITIAL_DATASET';
export const PRESENTATIONS_PAGE_REQUEST = 'PRESENTATIONS_PAGE_REQUEST';
export const PRESENTATIONS_PAGE_RESPONSE = 'PRESENTATIONS_PAGE_RESPONSE';
export const VOTEABLE_PRESENTATIONS_UPDATE_FILTER = 'VOTEABLE_PRESENTATIONS_UPDATE_FILTER';

export const setInitialDataSet = () => (dispatch, getState) => Promise.resolve().then(() => {
  const { userState: { userProfile } } = getState();
  return dispatch(createAction(SET_INITIAL_DATASET)({ userProfile }));
});

export const updateFilter = (filter) => (dispatch) => {
  dispatch(createAction(VOTEABLE_PRESENTATIONS_UPDATE_FILTER)({ ...filter }));
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
    createAction(PRESENTATIONS_PAGE_REQUEST),
    createAction(PRESENTATIONS_PAGE_RESPONSE),
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
    return (e);
  });
};