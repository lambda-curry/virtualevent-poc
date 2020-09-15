import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';

// these two libraries are client-side only
import SimpleChatWidget from 'simple-chat-widget/dist';
import 'simple-chat-widget/dist/index.css';

const SimpleChatWidgetComponent = class extends React.Component {

  render() {
      const { accessToken } = this.props;

    const widgetProps = {
        streamApiKey: envVariables.STREAM_IO_API_KEY,
        apiBaseUrl: envVariables.IDP_BASE_URL,
        accessToken: accessToken,
        forumSlug: envVariables.STREAM_IO_SSO_SLUG,
        onAuthError: (err, res) => console.log(err),
        openDir: "left",
        title: "Private Chat",
        showHelp: true,
        showQA: true,
        hideUsers: true,
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={{height: 500}}>
          <SimpleChatWidget {...widgetProps} {...this.props} />
        </div>
      </>
    )
  }
}

export default SimpleChatWidgetComponent