import React from 'react'
import { navigate } from "gatsby"
import { connect } from 'react-redux'
import moment from "moment-timezone";
import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

import styles from '../styles/next-event.module.scss'

class NextEventComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      display: true,
      minutesLeft: null,
    }
  }

  componentWillReceiveProps() {
    this.formatMinutes();
  }

  formatMinutes = () => {
    const { nextEvent, summit, now } = this.props;

    let eventStart = epochToMomentTimeZone(nextEvent.start_date, summit.time_zone_id)
    let nowFormatted = epochToMomentTimeZone(now, summit.time_zone_id)

    const diff = moment.duration(eventStart.diff(nowFormatted));

    this.setState({ minutesLeft: parseInt(diff.asMinutes()) });
  }

  handleRedirect = (value) => {
    this.setState({ display: false, redirect: value })
  }

  render() {
    const { redirect, display, minutesLeft } = this.state;
    const { nextEvent } = this.props;
    if (redirect && minutesLeft === 0) {
      navigate(`/a/event/${nextEvent.id}`);
      return null;
    } else {
      return (
        display &&
        <section className="hero">
          <div className={`columns`}>
            <div className={'column is-12'}>
              <div className={`${styles.body} hero-body`}>
                <span>
                  The next presentation <b>"{nextEvent.title}"</b> will start in {minutesLeft} minutes. Do you want to be automatically redirected after this talk?
              </span>
                <div className={styles.buttons}>
                  <button className="button is-large is-primary" onClick={() => this.handleRedirect(true)}>Yes</button>
                  <button className="button is-large is-secondary" onClick={() => this.handleRedirect(false)}>No</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }
  }
}

const mapStateToProps = ({ clockState }) => ({
  now: clockState.nowUtc
})

export default connect(mapStateToProps)(NextEventComponent);