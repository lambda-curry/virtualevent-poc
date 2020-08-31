import React from "react";
import { connect } from "react-redux";
import { Clock } from 'openstack-uicore-foundation/lib/components';
import { updateClock } from "../actions/clock-actions";

const ClockComponent = class extends React.Component {

  handleClockTick = (timestamp) => {
    const { updateClock, display } = this.props;
    if (display) updateClock(timestamp);
  };

  render() {
    const { summit, display } = this.props;

    return (
      <div>
        {summit && display &&
          <Clock onTick={this.handleClockTick} timezone={summit.time_zone_id} />
        }
      </div>
    );
  }
}


export default connect(null, { updateClock })(ClockComponent);