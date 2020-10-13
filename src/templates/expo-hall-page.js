import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'

import Tiers from '../content/sponsors-tiers.json'

const ExpoHallPage = () => {

  return (
    <Layout>
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

export default ExpoHallPage;
