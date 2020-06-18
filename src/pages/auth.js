import React from "react"
import { Router } from "@reach/router"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import { onUserAuth, doLogout, getUserInfo } from "openstack-uicore-foundation/lib/methods";

import Loadable from "@loadable/component"

// const LoadableAuthorizedRoute = Loadable(() => import('../routes/authorized-route')) 
const LoadableAuthorizationCallbackRoute = Loadable(() => import('../routes/authorization-callback-route'))
const LoadableLogOutCallbackRoute = Loadable(() => import('../routes/logout-callback-route'))

const Auth = class extends React.Component {

  render() {

    let { isLoggedUser, onUserAuth, doLogout, getUserInfo, member, backUrl, summit } = this.props;

    if (typeof window !== `undefined` && window.location.pathname === '/auth/callback' && isLoggedUser) {
      navigate('/a/')
    }

    return (
      <Router basepath="/auth">
        {/* <LoadableAuthorizedRoute isLoggedUser={false} doLogin={this.onClickLogin.bind(this)} backUrl={backUrl} path="/home" component={HomePage} /> */}
        <LoadableAuthorizationCallbackRoute onUserAuth={onUserAuth} path='/callback' getUserInfo={getUserInfo} />
        <LoadableLogOutCallbackRoute doLogout={doLogout} path='/logout' />
      </Router>
    )
  }
}

const mapStateToProps = ({ loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  backUrl: loggedUserState.backUrl,
})

export default connect(mapStateToProps, {
  onUserAuth,
  doLogout,
  getUserInfo,
})(Auth)