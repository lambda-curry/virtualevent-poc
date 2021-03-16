import React from "react"
import { Helmet } from 'react-helmet'

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite';
import 'schedule-lite/index.css';

import withAccessToken from "../utils/withAccessToken";

import { getEnvVariable, SUMMIT_API_BASE_URL, MARKETING_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';
import HomeSettings from '../content/home-settings.json'

const ScheduleLiteComponent = class extends React.Component {

  render() {

    const { className } = this.props;

    const scheduleProps = {
      apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
      marketingApiBaseUrl: getEnvVariable(MARKETING_API_BASE_URL),
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: parseInt(getEnvVariable(SUMMIT_ID)),
      onAuthError: (err, res) => expiredToken(err),
      onRef: ref => this.child = ref,
      defaultImage: HomeSettings.schedule_default_image
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div className={className ? className : this.props.page === 'marketing-site' ? 'schedule-container-marketing' : 'schedule-container'}>
          <ScheduleLite {...scheduleProps} {...this.props} />
        </div>
      </React.Fragment>
    )
  }
}

export default withAccessToken(ScheduleLiteComponent)