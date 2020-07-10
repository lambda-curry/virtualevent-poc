import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'

import LobbyHeroComponent from '../components/LobbyHeroComponent'
import ClockComponent from '../components/ClockComponent'
import SidebarAdvertise from '../components/SidebarAdvertiseComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import SpeakersWidgetComponent from '../components/SpeakersWidgetComponent'

import { getSummitData } from '../actions/summit-actions'

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

    const { loggedUser, summit, now } = this.props;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <h2><b>Community</b></h2>
              <SidebarAdvertise section='lobby' />
            </div>
            <div className="column is-half">
              <LiveEventWidgetComponent summitId={summit.id} />
              <SpeakersWidgetComponent
                accessToken={loggedUser.accessToken}
                summitId={summit.id}
                now={now}
              />
            </div>
            <div className="column is-one-quarter pb-6">
              <h2><b>My Info</b></h2>
              <ScheduleLiteComponent
                accessToken={loggedUser.accessToken}
                eventClick={(ev) => this.onEventChange(ev)}
              />
            </div>
          </div>
        </div>
        <ClockComponent summit={summit} now={now} />
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

const HomePage = ({ loggedUser, location, summit, getSummitData, now }) => {

  return (
    <Layout>
      <HomePageTemplate
        loggedUser={loggedUser}
        location={location}
        summit={summit}
        now={now}
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
  summit: summitState.summit,
  now: summitState.nowUtc,
})

export default connect(mapStateToProps,
  {
    getSummitData
  }
)(HomePage);
