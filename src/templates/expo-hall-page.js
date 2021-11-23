import React from 'react'

import { connect } from "react-redux";

import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import styles from '../styles/expo-hall.module.scss'

const ExpoHallPage = ({ location, imageHeader }) => {

  return (
    <Layout location={location}>
      <AttendanceTrackerComponent />
        <section className="hero is-large sponsors-header" style={{ backgroundImage: `url(${imageHeader})` }}>
          <div className={`hero-body ${styles.expoHallHero}`}>
            <div className="container">
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