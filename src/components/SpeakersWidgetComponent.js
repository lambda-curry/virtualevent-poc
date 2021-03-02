import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

import SpeakersWidget from 'speakers-widget';
import 'speakers-widget/index.css';

import withAccessToken from "../utils/withAccessToken";

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { accessToken, now, ...props } = this.props;

    if (accessToken == null) return null

    const widgetProps = {
      accessToken: accessToken,
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
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