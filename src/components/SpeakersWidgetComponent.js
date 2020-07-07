import React, { Component } from "react"
import { Helmet } from 'react-helmet'
import { navigate } from "gatsby";

// these two libraries are client-side only
import SpeakersWidget from 'speakers-widget/dist';
import 'speakers-widget/dist/index.css';

const SpeakersWidgetComponent = class extends React.Component {

  expiredToken(err) {
    
    let currentLocation = window.location.pathname;

    return navigate('/a/expired', {
      state: {
        backUrl: currentLocation,
      },
    });
  }

  render() {

    const { accessToken } = this.props;

    const widgetProps = {
      apiBaseUrl: `${typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}`,
      marketingApiBaseUrl: `${typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL}`,
      summitId: parseInt(typeof window === 'object' ? window.SUMMIT_ID : process.env.GATSBY_GATSBY_SUMMIT_ID),
      accessToken: accessToken,
      speakerCount: 3,
      bigPics: true,
      speakerIds: [1, 187, 190],
      onAuthError: (err, res) => this.expiredToken(err),
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