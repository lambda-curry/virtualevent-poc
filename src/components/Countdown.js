/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import moment from "moment-timezone";

import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

import styles from '../styles/countdown.module.scss'


class Countdown extends React.Component {

  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      timestamp: 0
    }
  }

  componentDidMount() {
    const { now } = this.props;
    this.setState({ timestamp: now });
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const { timestamp } = this.state;
    this.setState({ timestamp: timestamp + 1 })
  };

  render() {
    const { summit } = this.props;
    const { timestamp } = this.state;

    if (!timestamp || !summit.start_date || !summit.time_zone_id) return null;

    let summitDate = epochToMomentTimeZone(summit.start_date, summit.time_zone_id)
    let nowFormatted = epochToMomentTimeZone(timestamp, summit.time_zone_id)

    let diff = moment.duration(summitDate.diff(nowFormatted));
    let days = parseInt(diff.asDays());
    let hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
    hours = hours - days * 24;
    let minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
    minutes = minutes - (days * 24 * 60 + hours * 60);

    if (diff.asMilliseconds() > 0) {
      return (
        <div className={styles.countdown}>
          <div className={`${styles.countdownColumns} columns is-gapless`}>
            <div className={`${styles.leftColumn} column is-6 is-black`}>
              <div>Event Kickoff</div>
            </div>
            <div className={`${styles.rightColumn} column is-6 is-black`}>
              <div>
                <span className={styles.days}>{days}</span> Days
            </div>
              <div>
                <span className={styles.hours}>{hours}</span> Hours
            </div>
              <div>
                <span className={styles.minutes}>{minutes}</span> Minutes
            </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

}

export default Countdown;
