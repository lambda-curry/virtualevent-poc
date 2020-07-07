import React, { Component } from "react"
import { Helmet } from 'react-helmet'
import { navigate } from "gatsby";

// these two libraries are client-side only
import LiveEventWidget from 'live-event-widget/dist';
import 'live-event-widget/dist/index.css';

const LiveEventWidgetComponent = class extends React.Component {

  render() {

    const widgetProps = {
      apiBaseUrl: `${typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}`,
      marketingApiBaseUrl: `${typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL}`,
      summitId: parseInt(typeof window === 'object' ? window.SUMMIT_ID : process.env.GATSBY_GATSBY_SUMMIT_ID),
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <LiveEventWidget {...widgetProps} />
        </div>
      </>
    )
  }
}

export default LiveEventWidgetComponent