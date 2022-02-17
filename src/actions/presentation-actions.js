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

export const getVoteablePresentations = (page = 1, perPage = 10) => async (dispatch, getState) => {

  dispatch(startLoading());

  const accessToken = await getAccessToken();

  if (!accessToken) {
    dispatch(stopLoading());
    return Promise.resolve();
  }

  const params = {
    access_token: accessToken,
    expand: 'track, media_uploads, speakers',
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
  )(params)(dispatch).then((payload) => {
    const { response: { current_page } } = payload;
    if (current_page === 1) {
      const { presentationsState: { pagination: { pages, lastPage } } } = getState();
      const allPages = Array.from({ length: lastPage - 1}, (_, i) => i + 2);
      const dispatchCalls = allPages.map(p => dispatch(getVoteablePresentations(p, perPage)));
      Promise.all([...dispatchCalls]).then(() => {
        dispatch(stopLoading());
      });
      if (current_page === lastPage) dispatch(stopLoading());
    }
  }).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
};