import React from "react"

import withAccessToken from "../utils/withAccessToken";

import { AttendanceTracker } from "openstack-uicore-foundation/lib/components";

import envVariables from '../utils/envVariables';

const AttendanceTrackerComponent = class extends React.Component {

  render() {

    const { accessToken } = this.props;

    if (accessToken == null) return null

    const widgetProps = {
      accessToken: accessToken,
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      summitId: parseInt(envVariables.SUMMIT_ID),
      ...this.props
    };

    return <AttendanceTracker {...widgetProps} />
  }
}

export default withAccessToken(AttendanceTrackerComponent)