import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

// these two libraries are client-side only
import SpeakersWidget from 'speakers-widget/dist';
import 'speakers-widget/dist/index.css';

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { accessToken } = this.props;

    const widgetProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      accessToken: accessToken,
      speakerCount: 3,
      bigPics: true,
      speakerIds: [1, 187, 190],
      onAuthError: (err, res) => expiredToken(err),
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <SpeakersWidget {...widgetProps} />
        </div>
      </>
    )
  }
}

export default SpeakersWidgetComponent