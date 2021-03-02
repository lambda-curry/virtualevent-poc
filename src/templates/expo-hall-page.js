import React from 'react'

import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import Tiers from '../content/sponsors-tiers.json'

const ExpoHallPage = ({ location }) => {

  return (
    <Layout location={location}>
      <AttendanceTrackerComponent />
      <section className="hero is-large sponsors-header" style={{backgroundImage: `url(${Tiers.imageHeader})`}}>
        <div className="hero-body">
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

export default ExpoHallPage