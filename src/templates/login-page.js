import React from 'react'
import { connect } from 'react-redux'
import { navigate } from "gatsby"

import Layout from '../components/Layout'
import LoginButton from '../components/LoginButton'

import { getEnvVariable, AUTHORIZED_DEFAULT_PATH } from '../utils/envVariables'

export const LoginPageTemplate = ({ loggedUserState, location }) => {

  if (loggedUserState.isLoggedUser) {
    let defaultPath = getEnvVariable(AUTHORIZED_DEFAULT_PATH) ? getEnvVariable(AUTHORIZED_DEFAULT_PATH) : '/a/';
    navigate(defaultPath);
    return null
  }

  return (
    <React.Fragment>
      <LoginButton location={location}/>
    </React.Fragment>
  )
}

const LoginPage = ({ loggedUserState, location }) => {
  return (
    <Layout>
      <LoginPageTemplate
        loggedUserState={loggedUserState}
        location={location}
      />
    </Layout>
  )
}

export default connect(state => ({
  loggedUserState: state.loggedUserState
}), null)(LoginPage)