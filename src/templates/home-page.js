import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import LobbyHeroComponent from '../components/LobbyHeroComponent'

import { getSummitData } from '../actions/summit-actions'
import Loadable from "@loadable/component"

const ScheduleLiteClientSide = Loadable(() => import('../components/ScheduleLiteComponent'))
const LiveEventWidgetClientSide = Loadable(() => import('../components/LiveEventWidgetComponent'))
const SpeakersWidgetClientSide = Loadable(() => import('../components/SpeakersWidgetComponent'))

export const HomePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.onEventChange = this.onEventChange.bind(this);
  }

  componentWillMount() {
    const { loggedUser } = this.props;
    if (!loggedUser.isLoggedUser) {
      navigate('/a/login');
    }
    this.props.getSummitData();
  }

  onEventChange(ev) {
    navigate(`/a/event/${ev}`);
  }

  render() {

    const { loggedUser, summit } = this.props;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <h2><b>Community</b></h2>
              <div className="sponsor-container">
                <img src="/img/intel.png" alt="sponsor" />
              </div>
            </div>
            <div className="column is-half">
              <h2><b>Today's Sessions</b></h2>
              <LiveEventWidgetClientSide
                summitId={summit.id}
                apiBaseUrl={`${typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}`}
                marketingApiBaseUrl={`${typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL}`}
              />
              
              <SpeakersWidgetClientSide
                accessToken={loggedUser.accessToken}
                summitId={summit.id}
                apiBaseUrl={`${typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}`}
                marketingApiBaseUrl={`${typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL}`}
              />
            </div>
            <div className="column is-one-quarter pb-6">
              <h2><b>My Info</b></h2>
              <ScheduleLiteClientSide accessToken={loggedUser.accessToken} eventClick={(ev) => this.onEventChange(ev)} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

HomePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  summit: PropTypes.object,
  eventId: PropTypes.string,
  getSummitData: PropTypes.func,
}

const HomePage = ({ loggedUser, location, summit, getSummitData }) => {

  return (
    <Layout>
      <HomePageTemplate
        loggedUser={loggedUser}
        location={location}
        summit={summit}
        getSummitData={getSummitData}
      />
    </Layout>
  )

}

HomePage.propTypes = {
  summit: PropTypes.object,
  loggedUser: PropTypes.object,
  location: PropTypes.object,
}

const mapStateToProps = ({ loggedUserState, summitState }) => ({
  loggedUser: loggedUserState,
  summit: summitState.summit
})

export default connect(mapStateToProps,
  {
    getSummitData
  }
)(HomePage);
