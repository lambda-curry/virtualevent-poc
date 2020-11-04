import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

// these two libraries are client-side only
import SpeakersWidget from 'speakers-widget/dist';
import 'speakers-widget/dist/index.css';

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { now, ...props } = this.props;

    const widgetProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      date: now,
      // speakerIds: [1, 187, 190],
      onAuthError: (err, res) => expiredToken(err),
      // featured: true,
      ...props
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <SpeakersWidget {...widgetProps} />
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ clockState }) => ({
  now: clockState.nowUtc
})


export default connect(mapStateToProps, {})(SpeakersWidgetComponent)