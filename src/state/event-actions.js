/**
 * Copyright 2019
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import { authErrorHandler } from "openstack-uicore-foundation/lib/methods";

import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
  showMessage,
  showSuccessMessage,
} from 'openstack-uicore-foundation/lib/methods';

import axios from 'axios';

// import Swal from 'sweetalert2';

import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

export const GET_EVENT_DATA = 'GET_EVENT_DATA';
export const TOGGLE_DARKMODE = 'TOGGLE_DARKMODE';


export const handleResetReducers = () => (dispatch, getState) => {
  dispatch(createAction(LOGOUT_USER)({}));
}

export function getEventBySlug(slug) {

  let url = `${window.EVENT_API_BASE_URL}/api/public/v1/summits/${window.EVENT_SUMMIT_ID}/events/${slug}/published?expand=rsvp_template%2C+type%2C+track%2C+location%2C+location.venue%2C+location.floor%2C+speakers%2C+moderator%2C+sponsors%2C+groups%2C+feedback%2C+summit`;

  return function (dispatch) {
    axios.get(url)
      .then((response) => dispatch({
        type: GET_EVENT_DATA,
        payload: response.data
      })).catch((response) => dispatch({
        type: GET_EVENT_DATA,
        payload: response.error
      }))
  }
}