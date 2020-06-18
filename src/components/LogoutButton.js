import React from 'react'
import T from 'i18n-react/dist/i18n-react'
import URI from 'urijs';


export default class
  AuthButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showLogOut: false,
    };

    this.NONCE_LEN = 16;

    this.initLogOut = this.initLogOut.bind(this);
    this.getLogoutUrl = this.getLogoutUrl.bind(this);
    this.createNonce = this.createNonce.bind(this);

  }

  initLogOut() {
    let location = window.location;
    // check if we are on iframe
    if (window.top)
      location = window.top.location;
    this.getLogoutUrl(window.idToken).toString()
    location.replace(this.getLogoutUrl(window.idToken).toString());
  }

  getLogoutUrl(idToken) {
    let baseUrl = window.IDP_BASE_URL;
    let url = URI(`${baseUrl}/oauth2/end-session`);
    let state = this.createNonce(this.NONCE_LEN);
    let postLogOutUri = window.location.origin + '/auth/logout';
    let backUrl = URI(window.location.href).pathname();

    // store nonce to check it later
    window.localStorage.setItem('post_logout_state', state);
    window.localStorage.setItem('post_logout_back_uri', backUrl);
    /**
     * post_logout_redirect_uri should be listed on oauth2 client settings
     * on IDP
     * "Security Settings" Tab -> Logout Options -> Post Logout Uris
     */
    return url.query({
      "id_token_hint": idToken,
      "post_logout_redirect_uri": encodeURI(postLogOutUri),
      "state": state,
    });
  }

  createNonce(len) {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = '';
    for (let i = 0; i < len; i++) {
      nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
  }

  render() {
    let { isLoggedUser } = this.props;

    if (isLoggedUser) {
      return (

        <div className="logout-button">
          <span onClick={() => { this.props.clearState(); }}>
            Clear State |&nbsp;
          </span>                    
          <span className="dropdown-item" onClick={() => { this.initLogOut(); }}>
            Logout
          </span>
        </div>
      );
    } else {
      return null;
    }

  }
}