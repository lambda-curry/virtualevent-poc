import { navigate } from "gatsby";

import { createAction, stopLoading } from "openstack-uicore-foundation/lib/methods";
import { LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

export const customErrorHandler = (err, res) => (dispatch, state) => {
  let code = err.status;
  let msg = '';
  dispatch(stopLoading());
  switch (code) {
    // case 403:
    //     let error_message = {
    //         title: 'ERROR',
    //         html: T.translate("errors.user_not_authz"),
    //         type: 'error'
    //     };
    //     dispatch(showMessage( error_message, initLogOut ));
    //     break;
    case 401:
      let currentLocation = window.location.pathname;
      let clearing_session_state = window.clearing_session_state || false;
      // dispatch(createAction(LOGOUT_USER)({}));
      if (!clearing_session_state) {
        window.clearing_session_state = true;
        console.log('authErrorHandler 401 - re login');
        navigate('/a/expired', {
          state: {
            backUrl: currentLocation,
          },
        });
      }
      break;
    // case 404:
    //     msg = "";
    //     if (err.response.body && err.response.body.message) msg = err.response.body.message;
    //     else if (err.response.error && err.response.error.message) msg = err.response.error.message;
    //     else msg = err.message;
    //     Swal.fire("Not Found", msg, "warning");
    //     break;
    // case 412:
    //     for (var [key, value] of Object.entries(err.response.body.errors)) {
    //         if (isNaN(key)) {
    //             msg += key + ': ';
    //         }
    //         msg += value + '<br>';
    //     }
    //     Swal.fire("Validation error", msg, "warning");
    //     dispatch({
    //         type: VALIDATE,
    //         payload: {errors: err.response.body.errors}
    //     });
    //     break;
    default:
    // Swal.fire("ERROR", T.translate("errors.server_error"), "error");
  }
}