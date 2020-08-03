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
        streamApiKey: "29gtgpyz5hht",
        apiBaseUrl: "https://idp.dev.fnopen.com",
        accessToken: accessToken,
        forumSlug: "fnvirtual-poc",
        onAuthError: (err, res) => console.log(err),
        openDir: "left",
    };

    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={{height: 500}}>
          <SimpleChatWidget {...widgetProps} />
        </div>
      </>
    )
  }
}

export default SimpleChatWidgetComponent