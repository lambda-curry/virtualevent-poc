import React from "react"
import { Helmet } from 'react-helmet'

import SimpleChatWidget from 'simple-chat-widget';
import 'simple-chat-widget/index.css';

import withAccessToken from "../utils/withAccessToken";

import { getEnvVariable, STREAM_IO_API_KEY, IDP_BASE_URL, STREAM_IO_SSO_SLUG } from '../utils/envVariables';
import GeneralSettings from '../content/settings.json'

const SimpleChatWidgetComponent = class extends React.Component {

  render() {
    
    const { accessToken } = this.props;

    if (accessToken == null) return null

    const widgetProps = {
      accessToken: accessToken,
      streamApiKey: getEnvVariable(STREAM_IO_API_KEY),
      apiBaseUrl: getEnvVariable(IDP_BASE_URL),
      forumSlug: getEnvVariable(STREAM_IO_SSO_SLUG),
      onAuthError: (err, res) => console.log(err),
      openDir: "left",
      title: "Private Chat",
      showHelp: GeneralSettings.widgets.chat.showHelp,
      showQA: GeneralSettings.widgets.chat.showQA,
      hideUsers: false,
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={{height: 500}}>
          <SimpleChatWidget {...widgetProps} {...this.props} />
        </div>
      </React.Fragment>
    )
  }
}

export default withAccessToken(SimpleChatWidgetComponent)