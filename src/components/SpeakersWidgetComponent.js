import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

import SpeakersWidget from 'speakers-widget';
import 'speakers-widget/index.css';

import withAccessToken from "../utils/withAccessToken";

import { getEnvVariable, SUMMIT_API_BASE_URL,  MARKETING_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { accessToken, now, ...props } = this.props;

    if (accessToken == null) return null

    const widgetProps = {
      accessToken: accessToken,
      apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
      marketingApiBaseUrl: getEnvVariable(MARKETING_API_BASE_URL),
      summitId: parseInt(getEnvVariable(SUMMIT_ID)),
      date: now,
      onAuthError: (err, res) => expiredToken(err),
      ...props
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <SpeakersWidget {...widgetProps} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ clockState }) => ({
  now: clockState.nowUtc
})

export default withAccessToken(connect(mapStateToProps, {})(SpeakersWidgetComponent))