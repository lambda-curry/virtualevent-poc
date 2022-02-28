import {
  getAccessToken,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  putFile,
  createAction,
  startLoading,
  stopLoading,
  passwordlessLogin
} from 'openstack-uicore-foundation/lib/methods';

import Swal from 'sweetalert2';
import axios from "axios";
import { navigate } from 'gatsby-link';
import { customErrorHandler, customBadgeHandler } from '../utils/customErrorHandler';
import {getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID} from "../utils/envVariables";

export const GET_DISQUS_SSO                    = 'GET_DISQUS_SSO';
export const GET_ROCKETCHAT_SSO                = 'GET_ROCKETCHAT_SSO';
export const GET_USER_PROFILE                  = 'GET_USER_PROFILE';
export const START_LOADING_PROFILE             = 'START_LOADING_PROFILE';
export const STOP_LOADING_PROFILE              = 'STOP_LOADING_PROFILE';
export const UPDATE_PASSWORD                   = 'UPDATE_PASSWORD';
export const SET_AUTHORIZED_USER               = 'SET_AUTHORIZED_USER';
export const SET_USER_TICKET                   = 'SET_USER_TICKET';
export const UPDATE_PROFILE_PIC                = 'UPDATE_PROFILE_PIC';
export const UPDATE_EXTRA_QUESTIONS            = 'UPDATE_EXTRA_QUESTIONS';
export const START_LOADING_IDP_PROFILE         = 'START_LOADING_IDP_PROFILE';
export const STOP_LOADING_IDP_PROFILE          = 'STOP_LOADING_IDP_PROFILE';
export const GET_IDP_PROFILE                   = 'GET_IDP_PROFILE';
export const UPDATE_IDP_PROFILE                = 'UPDATE_IDP_PROFILE';
export const SCAN_BADGE                        = 'SCAN_BADGE';
export const SCAN_BADGE_SUCCESS                = 'SCAN_BADGE_SUCCESS';
export const SCAN_BADGE_ERROR                  = 'SCAN_BADGE_ERROR';
export const ADD_TO_SCHEDULE                   = 'ADD_TO_SCHEDULE';
export const REMOVE_FROM_SCHEDULE              = 'REMOVE_FROM_SCHEDULE';
export const SCHEDULE_SYNC_LINK_RECEIVED       = 'SCHEDULE_SYNC_LINK_RECEIVED';
export const SET_USER_ORDER                    = 'SET_USER_ORDER';
export const CAST_PRESENTATION_VOTE_REQUEST   = 'CAST_PRESENTATION_VOTE_REQUEST';
export const CAST_PRESENTATION_VOTE_RESPONSE   = 'CAST_PRESENTATION_VOTE_RESPONSE';
export const UNCAST_PRESENTATION_VOTE_REQUEST = 'UNCAST_PRESENTATION_VOTE_REQUEST';
export const UNCAST_PRESENTATION_VOTE_RESPONSE = 'UNCAST_PRESENTATION_VOTE_RESPONSE';
export const TOGGLE_PRESENTATION_VOTE          = 'TOGGLE_PRESENTATION_VOTE';

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

  let accessToken = null;
  try {
     accessToken = await getAccessToken();
  }
  catch (e){
    return Promise.resolve();
  }

  if (!accessToken) return Promise.resolve();
  let params = {
    access_token: accessToken,
    expand: 'groups,summit_tickets,summit_tickets,summit_tickets.owner,summit_tickets.owner.presentation_votes,summit_tickets.owner.extra_questions,summit_tickets.badge,summit_tickets.badge.features,summit_tickets.badge.type, summit_tickets.badge.type.access_levels,summit_tickets.badge.type.features,favorite_summit_events,feedback,schedule_summit_events,rsvp,rsvp.answers'
  };

  dispatch(startLoading());
  dispatch(createAction(START_LOADING_PROFILE)());
  return getRequest(
    null,
    createAction(GET_USER_PROFILE),
    `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/members/me`,
    customErrorHandler
  )(params)(dispatch).then(() => {
    return dispatch(getIDPProfile()).then(() => {
      return dispatch(getScheduleSyncLink()).then(() => dispatch(createAction(STOP_LOADING_PROFILE)()))
    });
  }).catch(() => dispatch(createAction(STOP_LOADING_PROFILE)()));
}

export const getIDPProfile = () => async (dispatch) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  dispatch(createAction(START_LOADING_IDP_PROFILE)());

  return getRequest(
      null,
      createAction(GET_IDP_PROFILE),
      `${window.IDP_BASE_URL}/api/v1/users/me`,
      customErrorHandler
  )(params)(dispatch)
      .then(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()))
      .catch(() => dispatch(createAction(STOP_LOADING_IDP_PROFILE)()));
}

export const requireExtraQuestions = () => (dispatch, getState) => {

  const { summitState : { summit }} = getState();
  const { userState: { userProfile } } = getState();

  const owner = userProfile?.summit_tickets[0]?.owner || null;
  // if user does not have an attendee then we dont require extra questions
  if(!owner) return false;
  if (!owner.first_name || !owner.last_name || !owner.company || !owner.email) return true;
  const disclaimer = summit.registration_disclaimer_mandatory ? owner.disclaimer_accepted : true;
  if (!disclaimer) return true;
  const requiredExtraQuestions = summit.order_extra_questions.filter(q => q.mandatory === true);
  if (requiredExtraQuestions.length > 0 && userProfile && userProfile.summit_tickets.length > 0) {
    const ticketExtraQuestions = userProfile?.summit_tickets[0]?.owner?.extra_questions || [];
    if (ticketExtraQuestions.length > 0) {
      return !requiredExtraQuestions.every(q => {
        const answer = ticketExtraQuestions.find(answer => answer.question_id === q.id);
        return answer && answer.value;
      });
    }
    return true;
  }
  return false;
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

export const addToSchedule = (event) => async (dispatch, getState) => {
  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.reject();

  const url = `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/members/me/schedule/${event.id}`;

  return axios.post(
      url, { access_token: accessToken }
  ).then(() => {
    dispatch(createAction(ADD_TO_SCHEDULE)(event));
    return event;
  }).catch(e => {
    console.log('ERROR: ', e);
    return e;
  });
};

export const removeFromSchedule = (event) => async (dispatch, getState) => {
  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.reject();

  const url = `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/members/me/schedule/${event.id}`;

  return axios.delete(
      url, { data: { access_token: accessToken } }
  ).then(() => {
    dispatch(createAction(REMOVE_FROM_SCHEDULE)(event));
    return event;
  }).catch(e => {
    console.log('ERROR: ', e);
    return e;
  });
};

export const castPresentationVote = (presentation) => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  const params = {
    access_token: accessToken,
  };

  const errorHandler = (err) => (dispatch, state) => {
    const { status, response: { text } } = err;
    if (status === 412) {
      if (text.includes('already vote')) {
        // 'confirm' as local vote
        dispatch(createAction(TOGGLE_PRESENTATION_VOTE)({ presentation, isVoted: true }));
      } else if (text.includes('Max. allowed votes') ||
                 text.includes('Member is not an attendee') ||
                 // Voting Period for track group is closed
                 text.includes('is closed')) {
        // need to revert button state
        // first 'confirm' as local vote
        dispatch(createAction(TOGGLE_PRESENTATION_VOTE)({ presentation, isVoted: true }));
        // inmediately remove vote
        dispatch(createAction(TOGGLE_PRESENTATION_VOTE)({ presentation, isVoted: false, reverting: true }));
      }
    } else {
      console.log('castPresentationVote error code: ', status, text);
    }
  };

  return postRequest(
    createAction(CAST_PRESENTATION_VOTE_REQUEST),
    createAction(CAST_PRESENTATION_VOTE_RESPONSE),
    `${getEnvVariable('SUMMIT_API_BASE_URL')}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/${presentation.id}/attendee-votes`,
    {},
    errorHandler,
    { presentation }
  )(params)(dispatch).catch(errorHandler);
};

export const uncastPresentationVote = (presentation) => async (dispatch, getState) => {

  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  const params = {
    access_token: accessToken,
  };

  const errorHandler = (err) => (dispatch, state) => {
    const { status, response: { text } } = err;
    if (status === 412 && text.includes('Vote not found')) {
      // tried removing a vote not longer present in api
      // confirming removal
      dispatch(createAction(TOGGLE_PRESENTATION_VOTE)({ presentation, isVoted: false }));
    } else {
      console.log('uncastPresentationVote error code: ', status, text);
    }
  };

  return deleteRequest(
    createAction(UNCAST_PRESENTATION_VOTE_REQUEST),
    createAction(UNCAST_PRESENTATION_VOTE_RESPONSE)({ presentation }),
    `${getEnvVariable('SUMMIT_API_BASE_URL')}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/${presentation.id}/attendee-votes`,
    {},
    errorHandler,
    { presentation }
  )(params)(dispatch).catch(errorHandler);
};

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

export const saveExtraQuestions = (extra_questions, owner, disclaimer) => async (dispatch, getState) => {

  const { userState: { userProfile: { summit_tickets } } } = getState();

  const extraQuestionsAnswers = extra_questions.map(q => {
    return { question_id: q.id, answer: `${q.value}` }
  })

  let normalizedEntity = {
    attendee_email: owner.email,
    attendee_first_name: owner.first_name,
    attendee_last_name: owner.last_name,
    attendee_company: owner.company,
    disclaimer_accepted: disclaimer,
    extra_questions: extraQuestionsAnswers
  };

  const accessToken = await getAccessToken();

  dispatch(startLoading());

  let params = {
    access_token: accessToken,
    expand: 'owner, owner.extra_questions'
  };

  return putRequest(
    null,
    createAction(UPDATE_EXTRA_QUESTIONS),
    `${window.API_BASE_URL}/api/v1/summits/all/orders/all/tickets/${summit_tickets[0].id}`,
    normalizedEntity,
    customErrorHandler
  )(params)(dispatch).then(() => {
    Swal.fire('Success', "Extra questions saved successfully", "success");
    dispatch(getUserProfile());
    navigate('/')
  }
  ).catch(e => {
    dispatch(stopLoading());
    Swal.fire('Error', "Error saving your questions. Please retry.", "warning");
    return (e);
  });
};

export const setPasswordlessLogin = (params) => (dispatch, getState) => {  
  return dispatch(passwordlessLogin(params))
    .then((res) => {      
      dispatch(getUserProfile());
    }, (err) => {
      return Promise.resolve(err)
    })
}

export const getScheduleSyncLink = () => async (dispatch) => {
  const accessToken = await getAccessToken();

  if (!accessToken) return Promise.resolve();

  let params = {
    access_token: accessToken,
  };

  return postRequest(
      null,
      createAction(SCHEDULE_SYNC_LINK_RECEIVED),
      `${window.SUMMIT_API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/members/me/schedule/shareable-link`,
      null,
      customErrorHandler,
  )(params)(dispatch);
};

export const setUserOrder = (order) => (dispatch) => Promise.resolve().then(() => {
  return dispatch(createAction(SET_USER_ORDER)(order));
})

export const checkOrderData = (order) => (dispatch, getState) => {

  const { userState: { idpProfile: { company, given_name, family_name } } } = getState();
  const { owner_company, owner_first_name, owner_last_name } = order;

  if (owner_company !== company || owner_first_name !== given_name || owner_last_name !== family_name) {
      const newProfile = {
          first_name: owner_first_name,
          last_name: owner_last_name,
          company: owner_company
      };
      dispatch(updateProfile(newProfile));
  }
}

/**
 * Peform virtual checking at show time for the current attendee
 * @param attendee
 * @returns {function(*=, *): *}
 */
export const doVirtualCheckIn = (attendee) =>  async (dispatch, getState) => {
  const accessToken = await getAccessToken();

  let params = {
    access_token: accessToken,
  };

  return putRequest(
      null,
      createAction(UPDATE_EXTRA_QUESTIONS),
      `${window.API_BASE_URL}/api/v1/summits/${attendee.summit_id}/attendees/${attendee.id}/virtual-check-in`,
      {},
      customErrorHandler
  )(params)(dispatch);
};