import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import withOrchestra from "../utils/widgetOrchestra";

import SummitObject from '../content/summit.json'
import HomeSettings from '../content/home-settings.json'

import LobbyHeroComponent from '../components/LobbyHeroComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import DisqusComponent from '../components/DisqusComponent'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import SpeakersWidgetComponent from '../components/SpeakersWidgetComponent'
import SponsorComponent from '../components/SponsorComponent'
import SimpleChatWidgetComponent from '../components/SimpleChatWidgetComponent'

import { getDisqusSSO, getUserProfile } from '../actions/user-actions'
import envVariables from "../utils/envVariables";
import {AttendanceTracker} from "openstack-uicore-foundation/lib/components";

export const HomePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);
    this.onEventChange = this.onEventChange.bind(this);
  }

  componentDidMount() {
    this.props.getDisqusSSO();
  }

  onEventChange(ev) {
    navigate(`/a/event/${ev.id}`);
  }

  onViewAllEventsClick() {
    navigate('/a/schedule')
  }

  render() {
    const { loggedUser, user, addWidgetRef, updateWidgets } = this.props;
    let { summit } = SummitObject;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <h2><b>Community</b></h2>
              <SponsorComponent page='lobby'/>
              <AdvertiseComponent section='lobby' column="left" style={{ marginTop: '2em' }} />
            </div>
            <div className="column is-half">
              <h2><b>Today's Sessions</b></h2>
              <LiveEventWidgetComponent
                onEventClick={(ev) => this.onEventChange(ev)}
                style={{marginBottom: '15px'}}
              />
              <DisqusComponent
                page="lobby"
                disqusSSO={user.disqusSSO}
                summit={summit}
                className="disqus-container-home"
                title="Public conversation"
              />
              <ScheduleLiteComponent
                accessToken={loggedUser.accessToken}
                onEventClick={(ev) => this.onEventChange(ev)}
                onViewAllEventsClick={() => this.onViewAllEventsClick()}
                landscape={HomeSettings.centerColumn.schedule.showAllEvents}
                yourSchedule={false}
                showNav={false}
                showAllEvents={HomeSettings.centerColumn.schedule.showAllEvents}
                onRef={addWidgetRef}
                updateCallback={updateWidgets}
                title={HomeSettings.centerColumn.schedule.showAllEvents ? "Full Schedule" : "Up Next"}
                eventCount={HomeSettings.centerColumn.schedule.showAllEvents ? 100 : 4}
                className={HomeSettings.centerColumn.schedule.showAllEvents ? "schedule-container-home" : ""}
              />
              {HomeSettings.centerColumn.speakers.showTodaySpeakers &&
                <SpeakersWidgetComponent
                  accessToken={loggedUser.accessToken}
                  title="Today's Speakers"
                  bigPics={true}
                />
              }
              {HomeSettings.centerColumn.speakers.showFeatureSpeakers &&
                <SpeakersWidgetComponent
                  accessToken={loggedUser.accessToken}
                  title="Featured Speakers"
                  bigPics={false}
                />
              }
              <AdvertiseComponent section='lobby' column="center" />
            </div>
            <div className="column is-one-quarter pb-6">
              <h2><b>My Info</b></h2>
              <SimpleChatWidgetComponent accessToken={loggedUser.accessToken} title="Private Chat" />
              <ScheduleLiteComponent
                accessToken={loggedUser.accessToken}
                onEventClick={(ev) => this.onEventChange(ev)}
                onViewAllEventsClick={() => this.onViewAllEventsClick()}
                title='My Schedule'
                landscape={true}
                yourSchedule={true}
                showNav={true}
                eventCount={10}
                slotCount={1}
                onRef={addWidgetRef}
                updateCallback={updateWidgets}
              />
              <AdvertiseComponent section='lobby' column="right" />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

const OrchestedTemplate = withOrchestra(HomePageTemplate);

const HomePage = (
  {
    location,
    loggedUser,
    user,
    getUserProfile,
    getDisqusSSO
  }
) => {  
  return (
    <Layout location={location}>
      <AttendanceTracker
          sourceName="LOBBY"
          summitId={SummitObject.summit.id}
          apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
          accessToken={loggedUser.accessToken}
      />
      <OrchestedTemplate
        loggedUser={loggedUser}
        user={user}
        getUserProfile={getUserProfile}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

HomePage.propTypes = {
  loggedUser: PropTypes.object,
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

HomePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = ({ loggedUserState, userState }) => ({
  loggedUser: loggedUserState,
  user: userState,
})

export default connect(mapStateToProps,
  {
    getDisqusSSO,
    getUserProfile
  }
)(HomePage);