import React from 'react';
import { connect } from 'react-redux';
import Clock from 'openstack-uicore-foundation/lib/components/clock';
import { updateClock } from '../actions/clock-actions';

const ClockComponent = ({
  active,
  summit,
  updateClock
}) => {
  return (
    <div>
      {active && summit &&
      <Clock onTick={(timestamp) => updateClock(timestamp)} timezone={summit.time_zone_id} />
      }
    </div>
  );
}

export default connect(null, { updateClock })(ClockComponent);