import { 
  createAction,
  getRequest,
  startLoading,
  stopLoading } from 'openstack-uicore-foundation/lib/utils/actions';

import { customErrorHandler } from '../utils/customErrorHandler';

export const RESET_STATE = 'RESET_STATE';
export const SYNC_DATA = 'SYNC_DATA';
export const GET_THIRD_PARTY_PROVIDERS = 'GET_THIRD_PARTY_PROVIDERS';

export const resetState = () => (dispatch) => {
  dispatch(createAction(RESET_STATE)({}));
};

export const syncData = () => (dispatch, getState) => {
  const {userState, loggedUserState} = getState();
  const {isLoggedUser} = loggedUserState;
  const {userProfile} = userState;

  dispatch(createAction(SYNC_DATA)({isLoggedUser, userProfile }));
};

export const getThirdPartyProviders = () => (dispatch) => {
  dispatch(startLoading());

  return getRequest(
    null,
    createAction(GET_THIRD_PARTY_PROVIDERS),
    `${window.IDP_BASE_URL}/oauth2/.well-known/openid-configuration`,
    customErrorHandler
  )({})(dispatch).then(payload => {
    dispatch(stopLoading());
    return (payload)
  }).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}