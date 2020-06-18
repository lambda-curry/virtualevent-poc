import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'

import { getSummitData } from '../state/summit-actions'

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
      <div className="schedule">
        <div className="schedule__row">
          <div className="schedule__row--left">
            <div className="rocket-container">
              <h2>Welcome to {summit.name}</h2>
              <br />
              <ScheduleLiteClientSide accessToken={loggedUser.accessToken} eventClick={(ev) => this.onEventChange(ev)} />
            </div>
          </div>
          <div className="schedule__row--right">
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

const HomePage = ({ data, loggedUser, location, summit, getSummitData }) => {

  if (data) {
    const { event } = data
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
  } else {
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
}

HomePage.propTypes = {
  data: PropTypes.object,
  loggedUser: PropTypes.object,
  location: PropTypes.object,
}

// export const HomePageQuery = graphql`
//   query HomePage($id: String!) {
//     event(id: { eq: $id }) {
//       title
//       description
//       attending_media      
//       end_date
//       etherpad_link
//       meeting_url
//       start_date
//       streaming_url
//       timezone
//     }
//   }
// `

const mapStateToProps = ({ loggedUserState, summitState }) => ({
  loggedUser: loggedUserState,
  summit: summitState.summit
})

export default connect(mapStateToProps,
  {
    getSummitData
  }
)(HomePage);
