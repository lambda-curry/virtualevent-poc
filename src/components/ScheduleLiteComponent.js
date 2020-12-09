import React from "react"
import { Helmet } from 'react-helmet'

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite-test-packaging';
import 'schedule-lite-test-packaging/index.css';

import HomeSettings from '../content/home-settings.json'

const ScheduleComponent = class extends React.Component {

  render() {

    const scheduleProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: parseInt(envVariables.SUMMIT_ID),
      onAuthError: (err, res) => expiredToken(err),
      onRef: ref => this.child = ref,
      defaultImage: HomeSettings.schedule_default_image
    };

    const { className } = this.props;

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

export default ScheduleComponent