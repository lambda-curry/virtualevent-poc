import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,  
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

export const GET_DISQUS_SSO         = 'GET_DISQUS_SSO';
export const GET_ROCKETCHAT_SSO     = 'GET_ROCKETCHAT_SSO';
export const GET_USER_PROFILE       = 'GET_USER_PROFILE';
export const REQUEST_USER_PROFILE   = 'REQUEST_USER_PROFILE';
export const START_LOADING_PROFILE  = 'START_LOADING_PROFILE';
export const STOP_LOADING_PROFILE   = 'STOP_LOADING_PROFILE';

export const getDisqusSSO = () => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  return getRequest(
    null,
    createAction(GET_DISQUS_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/disqus/openinfra2020/profile?access_token=${accessToken}`,
    customErrorHandler
  )({})(dispatch).then(() => {
  }
  ).catch(e => {
    return (e);
  });
}


export const getRocketChatSSO = () => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_ROCKETCHAT_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/rocket-chat/fnvirtual-poc/profile?access_token=${accessToken}`,
    customErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}

export const getUserProfile = () => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  if (!accessToken) return Promise.resolve();

  let params = {
      access_token : accessToken,      
      expand: 'groups,summit_tickets'
  };

  return getRequest(
      createAction(START_LOADING_PROFILE),
      createAction(GET_USER_PROFILE),
      `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/members/me`,
      customErrorHandler
  )(params)(dispatch).then(() => dispatch(dispatch(createAction(STOP_LOADING_PROFILE))));
};
