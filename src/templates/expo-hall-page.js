import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'

import Tiers from '../content/sponsors-tiers.json'
import SummitObject from "../content/summit";
import envVariables from "../utils/envVariables";
import {AttendanceTracker} from "openstack-uicore-foundation/lib/components";
import {connect} from "react-redux";

const ExpoHallPage = ({accessToken, location}) => {

  return (
    <Layout location={location}>
      <AttendanceTracker
          summitId={SummitObject.summit.id}
          apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
          accessToken={accessToken}
      />
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

const mapStateToProps = ({ loggedUserState }) => ({
    accessToken: loggedUserState.accessToken,
})

export default connect(mapStateToProps)(ExpoHallPage)
