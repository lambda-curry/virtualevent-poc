import React from "react"
import AttendanceTracker from "openstack-uicore-foundation/lib/components/attendance-tracker";
import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

const AttendanceTrackerComponent = class extends React.Component {

  render() {

    const widgetProps = {
      apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
      summitId: parseInt(getEnvVariable(SUMMIT_ID)),
      ...this.props
    };

    return <AttendanceTracker {...widgetProps} />
  }
}

export default AttendanceTrackerComponent;