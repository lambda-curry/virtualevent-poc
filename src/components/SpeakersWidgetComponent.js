import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

import ClockComponent from './ClockComponent'

// these two libraries are client-side only
import SpeakersWidget from 'speakers-widget/dist';
import 'speakers-widget/dist/index.css';

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { accessToken, title, bigPics, now, summit } = this.props;

    const widgetProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      accessToken: accessToken,
      title,
      bigPics,
      title: title,
      date: parseInt(now, 10),
      // speakerIds: [1, 187, 190],
      onAuthError: (err, res) => expiredToken(err),
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <ClockComponent summit={summit} />
          {now && <SpeakersWidget {...widgetProps} />}
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ summitState }) => ({
  summit: summitState.summit,
  now: summitState.nowUtc,
})


export default connect(mapStateToProps, {})(SpeakersWidgetComponent)