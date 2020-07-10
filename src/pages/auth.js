import React from "react"
import { Router } from "@reach/router"
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import { onUserAuth, doLogout, getUserInfo } from "openstack-uicore-foundation/lib/methods";
import TokenExpirePage from "../templates/token-expire-page"

import AuthorizationCallbackRoute from "../routes/authorization-callback-route"
import LogOutCallbackRoute from "../routes/logout-callback-route"

const Auth = class extends React.Component {

  render() {

    let { isLoggedUser, onUserAuth, doLogout, getUserInfo, location } = this.props;

    if (typeof window !== `undefined` && window.location.pathname === '/auth/callback' && isLoggedUser) {
      navigate('/a/')
    }

    return (
      <Router basepath="/auth">
        <AuthorizationCallbackRoute onUserAuth={onUserAuth} path='/callback' getUserInfo={getUserInfo} />
        <LogOutCallbackRoute doLogout={doLogout} path='/logout' />
        <TokenExpirePage path="/expired" location={location} />
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