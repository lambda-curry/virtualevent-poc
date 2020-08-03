import expiredToken from './expiredToken';

import { stopLoading } from "openstack-uicore-foundation/lib/methods";

export const customErrorHandler = (err, res) => (dispatch, state) => {
  let code = err.status;
  dispatch(stopLoading());
  switch (code) {
    case 401:
      console.log('authErrorHandler 401 - re login');
      expiredToken(err);
      break;
    default:
      break;
  }
}