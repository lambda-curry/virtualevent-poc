import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';

// these two libraries are client-side only
import LiveEventWidget from 'live-event-widget/dist';
import 'live-event-widget/dist/index.css';
import HomeSettings from "../content/home-settings";

const LiveEventWidgetComponent = class extends React.Component {

  render() {

    const { style } = this.props;

    const widgetProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      title: "",
      featuredRoomId: 522,
      defaultImage: HomeSettings.schedule_default_image
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={style}>
          <LiveEventWidget {...widgetProps} {...this.props} />
        </div>
      </>
    )
  }
}

export default LiveEventWidgetComponent