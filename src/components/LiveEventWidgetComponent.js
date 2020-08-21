import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';

// these two libraries are client-side only
import LiveEventWidget from 'live-event-widget/dist';
import 'live-event-widget/dist/index.css';

const LiveEventWidgetComponent = class extends React.Component {

  render() {

    const widgetProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      title: "",
    };

    return (
      <>
        <Helmet>
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