import React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'

import '../styles/login.scss'
import LoginButton from '../components/LoginButton'

import { navigate } from "gatsby"

export const LoginPageTemplate = ({ loggedUserState }) => {

  if (loggedUserState.isLoggedUser) {
    navigate('/a/')
  }

  return (
    <React.Fragment>
      <LoginButton />
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