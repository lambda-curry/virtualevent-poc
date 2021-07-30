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
import { isAuthorizedUser } from '../utils/authorizedGroups';

export const GET_DISQUS_SSO            = 'GET_DISQUS_SSO';
export const GET_ROCKETCHAT_SSO        = 'GET_ROCKETCHAT_SSO';
export const GET_USER_PROFILE          = 'GET_USER_PROFILE';
export const REQUEST_USER_PROFILE      = 'REQUEST_USER_PROFILE';
export const START_LOADING_PROFILE     = 'START_LOADING_PROFILE';
export const STOP_LOADING_PROFILE      = 'STOP_LOADING_PROFILE';
export const UPDATE_PASSWORD           = 'UPDATE_PASSWORD';
export const SET_AUTHORIZED_USER       = 'SET_AUTHORIZED_USER';
export const SET_USER_TICKET           = 'SET_USER_TICKET';
export const UPDATE_PROFILE_PIC        = 'UPDATE_PROFILE_PIC';
export const START_LOADING_IDP_PROFILE = 'START_LOADING_IDP_PROFILE';
export const STOP_LOADING_IDP_PROFILE  = 'STOP_LOADING_IDP_PROFILE';
export const GET_IDP_PROFILE           = 'GET_IDP_PROFILE';
export const UPDATE_IDP_PROFILE        = 'UPDATE_IDP_PROFILE';
export const SCAN_BADGE                = 'SCAN_BADGE';
export const SCAN_BADGE_SUCCESS        = 'SCAN_BADGE_SUCCESS';
export const SCAN_BADGE_ERROR          = 'SCAN_BADGE_ERROR';
export const ADD_TO_SCHEDULE           = 'ADD_TO_SCHEDULE';
export const REMOVE_FROM_SCHEDULE      = 'REMOVE_FROM_SCHEDULE';

export const getDisqusSSO = () => async (dispatch) => {

  const accessToken = await getAccessToken();

  return getRequest(
    null,
    createAction(GET_DISQUS_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/disqus/fnvirtual-poc/profile?access_token=${accessToken}`,
    customErrorHandler
  )({})(dispatch).then(() => {
  }).catch(e => {
    return (e);
  });
}

export const getRocketChatSSO = () => async (dispatch) => {

  const accessToken = await getAccessToken();

  return getRequest(
    null,
    createAction(GET_ROCKETCHAT_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/rocket-chat/fnvirtual-poc/profile?access_token=${accessToken}`,
    customErrorHandler
  )({})(dispatch).then(() => {
  }).catch(e => {
    return (e);
  });
}

export const getUserProfile = () => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
    expand: 'groups,summit_tickets,summit_tickets.badge,summit_tickets.badge.features,summit_tickets.badge.type,favorite_summit_events,feedback,schedule_summit_events,rsvp,rsvp.answers'
  };

  dispatch(startLoading());

  return getRequest(
    null,
    createAction(GET_USER_PROFILE),
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/members/me`,
    customErrorHandler
  )(params)(dispatch).then(() => {
    dispatch(setAuthorization());
    dispatch(setUserTicket());
    dispatch(getIDPProfile());
    return dispatch(createAction(STOP_LOADING_PROFILE)());
  });
}

const setAuthorization = () => (dispatch, getState) => {
  const { userState: { userProfile } } = getState();
  const isAuthorized = isAuthorizedUser(userProfile.groups)
  return dispatch(createAction(SET_AUTHORIZED_USER)(isAuthorized));
}

const setUserTicket = () => (dispatch, getState) => {
  const { userState: { userProfile } } = getState();
  const hasTicket = userProfile.summit_tickets?.length > 0;
  return dispatch(createAction(SET_USER_TICKET)(hasTicket));
}

export const scanBadge = (sponsorId) => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
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
      let msg = 'Thanks for sharing your info!';
      Swal.fire("Success", msg, "success");
      return (payload)
    })
    .catch(e => {
      dispatch(createAction(SCAN_BADGE_ERROR)(e));
      return (e);
    });
}

export const getIDPProfile = () => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  dispatch(createAction(START_LOADING_IDP_PROFILE)());

  getRequest(
    null,
    createAction(GET_IDP_PROFILE),
    `${window.IDP_BASE_URL}/api/v1/users/me`,
    customErrorHandler
  )(params)(dispatch)
    .then(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()))
    .catch(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()));
}

export const addToSchedule = (event) => (dispatch, getState) => {  
  dispatch(createAction(ADD_TO_SCHEDULE)(event));
}

export const removeFromSchedule = (event) => (dispatch, getState) => {    
  dispatch(createAction(REMOVE_FROM_SCHEDULE)(event));
}

export const updateProfilePicture = (pic) => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  dispatch(createAction(START_LOADING_IDP_PROFILE)());

  putFile(
    null,
    createAction(UPDATE_PROFILE_PIC),
    `${window.IDP_BASE_URL}/api/v1/users/me/pic`,
    pic,
    {},
    customErrorHandler,
  )(params)(dispatch)
    .then(() => dispatch(getIDPProfile()))
    .catch(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()));
}

export const updateProfile = (profile) => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  dispatch(createAction(START_LOADING_IDP_PROFILE)());

  putRequest(
    null,
    createAction(UPDATE_IDP_PROFILE),
    `${window.IDP_BASE_URL}/api/v1/users/me`,
    profile,
    customErrorHandler
  )(params)(dispatch)
    .then(() => dispatch(getIDPProfile()))
    .catch(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()));
}

export const updatePassword = (password) => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  dispatch(createAction(START_LOADING_IDP_PROFILE)());

  putRequest(
    null,
    createAction(UPDATE_PASSWORD),
    `${window.IDP_BASE_URL}/api/v1/users/me`,
    password,
    customErrorHandler
  )(params)(dispatch)
    .then(() => {
      dispatch(createAction(STOP_LOADING_IDP_PROFILE)());
      let msg = 'Password Updated';
      Swal.fire("Success", msg, "success");
    })
    .catch(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()));
}