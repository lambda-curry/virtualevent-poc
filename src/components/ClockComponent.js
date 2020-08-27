import React from "react";
import { connect } from "react-redux";
import { Clock } from 'openstack-uicore-foundation/lib/components';
import { updateClock } from "../actions/clock-actions";

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

const mapStateToProps = ({ clockState }) => ({  
  now: clockState.nowUtc,
})

export default connect(mapStateToProps, { updateClock })(ClockComponent);