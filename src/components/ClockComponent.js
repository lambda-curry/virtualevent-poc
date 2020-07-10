import React from "react";
import { connect } from "react-redux";
import { Clock } from 'openstack-uicore-foundation/lib/components';
import { updateClock } from "../actions/summit-actions";

const ClockComponent = class extends React.Component {

  handleClockTick = (timestamp) => {
    const { updateClock } = this.props;
    updateClock(timestamp);
  };

  render() {
    const { summit, now } = this.props;

    return (
      <div>
        {summit &&
          <Clock onTick={this.handleClockTick} timezone={summit.time_zone_id} now={now} />
        }
      </div>
    );
  }
}

export default connect(null, { updateClock })(ClockComponent);