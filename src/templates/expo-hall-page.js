import React from 'react'

import { connect } from "react-redux";

import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'
import AccessTracker from '../components/AttendeeToAttendeeWidgetComponent'

import styles from '../styles/expo-hero.module.scss'

const ExpoHallPage = ({ location, imageHeader }) => {
  return (
    <Layout location={location}>
      <AttendanceTrackerComponent />
      <AccessTracker />
        <section className="hero is-large sponsors-header" style={{ backgroundImage: `url(${imageHeader.file})` }}>
          <div className="hero-body">
            <div className={styles.heroContainer}>
              <h1 className={styles.title}>
                Sponsors
              </h1>
              <span className={styles.subtitle}>
                See the schedule to join live sessions and meet representatives from the sponsor companies.
              </span>
            </div>
          </div>
        </section>
      <section className="section px-6 py-6">
        <SponsorComponent />
      </section>
    </Layout>
  )
}

const mapStateToProps = ({ sponsorState }) => ({
  imageHeader: sponsorState.imageHeader
});

export default connect(mapStateToProps, {})(ExpoHallPage);