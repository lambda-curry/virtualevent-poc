/**
 * Copyright 2017 OpenStack Foundation
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

import React from 'react'
import URI from "urijs"
import { navigate } from "gatsby"
import { Redirect } from '@reach/router'
import { connect } from 'react-redux';
import { AbstractAuthorizationCallbackRoute } from "openstack-uicore-foundation/lib/components";
import { getUserProfile } from '../actions/user-actions'

import HeroComponent from "../components/HeroComponent";

import { getEnvVariable, IDP_BASE_URL, OAUTH2_CLIENT_ID } from '../utils/envVariables'

class AuthorizationCallbackRoute extends AbstractAuthorizationCallbackRoute {

  constructor(props) {
    super(getEnvVariable(IDP_BASE_URL), getEnvVariable(OAUTH2_CLIENT_ID), props);
  }

  _callback(backUrl) {
    this.props.getUserProfile().then(() => navigate(URI.decode(backUrl)) );
  }
  
  _redirect2Error(error) {
    console.log(`AuthorizationCallbackRoute error ${error}`);
    if (
        error.includes('access_denied') ||
        error.includes('consent_required')
    ) return <Redirect to={'/'} noThrow />;
    return <Redirect to={`/error?error=${error}`} noThrow/>;
  }

  render() {
    return <HeroComponent title="Checking credentials..."/>;
  }
}

export default connect(null, { getUserProfile })(AuthorizationCallbackRoute)