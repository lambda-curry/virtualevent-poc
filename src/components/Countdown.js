import React from "react"
import moment from 'moment-timezone';

import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

import styles from '../styles/countdown.module.scss'

const Countdown = ({ ...props }) => {

  const summitDate = moment('08-17-202020 09:00 AM', 'MM-DD-YYYY hh:mm A')
  const nowFormatted = epochToMomentTimeZone(props.now, props.summit.time_zone.name).format('MM-DD-YYYY hh:mm A')

  let diff = moment.duration(moment(summitDate).diff(moment(nowFormatted)));
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
export default Countdown