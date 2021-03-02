import {
  getAccessToken,
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
  putFile,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import Swal from 'sweetalert2';

import { customErrorHandler, customBadgeHandler } from '../utils/customErrorHandler';

export const GET_DISQUS_SSO            = 'GET_DISQUS_SSO';
export const GET_ROCKETCHAT_SSO        = 'GET_ROCKETCHAT_SSO';
export const GET_USER_PROFILE          = 'GET_USER_PROFILE';
export const REQUEST_USER_PROFILE      = 'REQUEST_USER_PROFILE';
export const START_LOADING_PROFILE     = 'START_LOADING_PROFILE';
export const STOP_LOADING_PROFILE      = 'STOP_LOADING_PROFILE';
export const UPDATE_PROFILE_PIC        = 'UPDATE_PROFILE_PIC';
export const START_LOADING_IDP_PROFILE = 'START_LOADING_IDP_PROFILE';
export const STOP_LOADING_IDP_PROFILE  = 'STOP_LOADING_IDP_PROFILE';
export const GET_IDP_PROFILE           = 'GET_IDP_PROFILE';
export const UPDATE_IDP_PROFILE        = 'UPDATE_IDP_PROFILE';
export const SCAN_BADGE                = 'SCAN_BADGE';
export const SCAN_BADGE_SUCCESS        = 'SCAN_BADGE_SUCCESS';
export const SCAN_BADGE_ERROR          = 'SCAN_BADGE_ERROR';

export const getDisqusSSO = () => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  return getRequest(
    null,
    createAction(GET_DISQUS_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/disqus/fnvirtual-poc/profile?access_token=${accessToken}`,
    customErrorHandler
  )({})(dispatch).then(() => {
  }
  ).catch(e => {
    return (e);
  });
}

export const getRocketChatSSO = () => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

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

export const getUserProfile = () => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
    expand: 'groups,summit_tickets,summit_tickets.badge,summit_tickets.badge.features,summit_tickets.badge.type'
  };

  return getRequest(
    createAction(START_LOADING_PROFILE),
    createAction(GET_USER_PROFILE),
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/members/me`,
    customErrorHandler
  )(params)(dispatch).then(() => dispatch(dispatch(createAction(STOP_LOADING_PROFILE))));
}

export const scanBadge = (sponsorId) => async (dispatch, getState) => {

  const accessToken = await getAccessToken();
  
  if (!accessToken) return Promise.resolve();
  
  let params = {
      access_token : accessToken,          
  };  

  return postRequest(
    createAction(SCAN_BADGE),
    createAction(SCAN_BADGE_SUCCESS),        
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/sponsors/${sponsorId}/user-info-grants/me`,
    null,
    customBadgeHandler,
    // entity
)(params)(dispatch)
    .then((payload) => {
        let msg = 'Badge scan successful';
        Swal.fire("Success", msg, "success");
        return (payload)
    })
    .catch(e => {
        dispatch(createAction(SCAN_BADGE_ERROR)(e));
        dispatch(stopLoading());
        return (e);
    });
}

export const getIDPProfile = () => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  getRequest(
    createAction(START_LOADING_IDP_PROFILE),
    createAction(GET_IDP_PROFILE),
    `${window.IDP_BASE_URL}/api/v1/users/me`,
    customErrorHandler
  )(params)(dispatch)
    .then(() => dispatch(dispatch(createAction(STOP_LOADING_IDP_PROFILE))));
}

export const updateProfilePicture = (pic) => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  putFile(
    createAction(START_LOADING_IDP_PROFILE),
    createAction(UPDATE_PROFILE_PIC),
    `${window.IDP_BASE_URL}/api/v1/users/me/pic`,
    pic,
    {},
    customErrorHandler,
  )(params)(dispatch)
    .then(() => dispatch(getIDPProfile()));
}

export const updateProfile = (profile) => async (dispatch, getState) => {
  
  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  putRequest(
    createAction(START_LOADING_IDP_PROFILE),
    createAction(UPDATE_IDP_PROFILE),
    `${window.IDP_BASE_URL}/api/v1/users/me`,
    profile,
    customErrorHandler
  )(params)(dispatch)
    .then(() => dispatch(getIDPProfile()))
    .catch(() => dispatch(dispatch(createAction(STOP_LOADING_IDP_PROFILE))));
}