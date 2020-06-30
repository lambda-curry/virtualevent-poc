import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import LiveEventWidget from 'live-event-widget/dist'

import { getSummitData } from '../actions/summit-actions'

import Loadable from "@loadable/component"

const ScheduleLiteClientSide = Loadable(() => import('../components/ScheduleLiteComponent'))


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
      <div className="container pt-5 pb-5">
        <div className="columns">
          <div className="column is-three-quarters">
            <div className="rocket-container">
              {summit && <h2>Welcome to {summit.name}</h2>}
              <br />
              <ScheduleLiteClientSide accessToken={loggedUser.accessToken} eventClick={(ev) => this.onEventChange(ev)} />
            </div>
            <div>
              <LiveEventWidget
                  summitId={summit.id}
                  apiBaseUrl={process.env.GATSBY_SUMMIT_API_BASE_URL}
                  marketingApiBaseUrl={process.env.GATSBY_MARKETING_API_BASE_URL}
              />
            </div>
          </div>
          <div className="column is-one-quarter pb-6">
            <div className="sponsor-container">
              <img src="/img/intel.png" alt="sponsor" />
            </div>
          </div>
        </div>
      </div>
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
