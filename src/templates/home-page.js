import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import withOrchestra from "../utils/widgetOrchestra";

import LobbyHeroComponent from '../components/LobbyHeroComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'
import LiteScheduleComponent from '../components/LiteScheduleComponent'
import UpcomingEventsComponent from '../components/UpcomingEventsComponent'
import DisqusComponent from '../components/DisqusComponent'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import SpeakersWidgetComponent from '../components/SpeakersWidgetComponent'
import SponsorComponent from '../components/SponsorComponent'
import AccessTracker, {
  AttendeesWidget,
} from "../components/AttendeeToAttendeeWidgetComponent"
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'

import { getDisqusSSO, getUserProfile } from '../actions/user-actions'


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

  onViewAllMyEventsClick() {
    navigate('/a/my-schedule')
  }

  render() {
    const { user, summit, homeSettings } = this.props;

    return (
      <React.Fragment>
        <LobbyHeroComponent />
        <div className="px-5 py-5 mb-6">
          <div className="columns">
            <div className="column is-one-quarter">
              <section className="home-section" aria-labelledby="sponsors-title">
                <h2 id="sponsors-title">Sponsors</h2>
                <SponsorComponent page='lobby'/>
                <AdvertiseComponent section='lobby' column="left" />
              </section>
            </div>
            <div className="column is-half">
              <section className="home-section" aria-labelledby="events-title">
                <h2 id="events-title">Today's Sessions</h2>
                <LiveEventWidgetComponent
                  onlyPresentations={true}
                  featuredEventId={homeSettings.live_now_featured_event_id}
                  onEventClick={(ev) => this.onEventChange(ev)}
                  style={{marginBottom: '15px'}}
                />
              </section>
              <DisqusComponent
                page="lobby"
                disqusSSO={user.disqusSSO}
                summit={summit}
                className="disqus-container-home"
                title="Public conversation"
                skipTo="#upcoming-events"
              />
              <UpcomingEventsComponent
                onEventClick={(ev) => this.onEventChange(ev)}
                onViewAllEventsClick={() => this.onViewAllEventsClick()}
                title="Up Next"
                eventCount={4}
                />
              {homeSettings.centerColumn.speakers.showTodaySpeakers &&
                <SpeakersWidgetComponent
                  title="Today's Speakers"
                  bigPics={true}
                />
              }
              {homeSettings.centerColumn.speakers.showFeatureSpeakers &&
                <SpeakersWidgetComponent
                  title="Featured Speakers"
                  bigPics={false}
                  featured={true}
                  date={null}
                />
              }
              <AdvertiseComponent section='lobby' column="center" />
            </div>
            <div className="column is-one-quarter pb-6">
              <section className="home-section" aria-labelledby="info-title">
                <h2 id="info-title">My Info</h2>
                <AccessTracker />
                <AttendeesWidget user={user} />
                <LiteScheduleComponent
                  onEventClick={(ev) => this.onEventChange(ev)}
                  onViewAllEventsClick={() => this.onViewAllMyEventsClick()}
                  title='My Schedule'
                  yourSchedule={true}
                  showNav={true}
                  eventCount={10}
                />
              </section>
              <section aria-label="Other sponsors">
                <AdvertiseComponent section='lobby' column="right" />
              </section>
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
    user,
    getUserProfile,
    getDisqusSSO,
    homeSettings,
    summit
  }
) => {  
  return (
    <Layout location={location}>
      <AttendanceTrackerComponent sourceName="LOBBY" />
      <OrchestedTemplate
        user={user}
        getUserProfile={getUserProfile}
        getDisqusSSO={getDisqusSSO}
        homeSettings={homeSettings}
        summit={summit}
      />
    </Layout>
  )
};

HomePage.propTypes = {
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

HomePageTemplate.propTypes = {
  user: PropTypes.object,
  getUserProfile: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

const mapStateToProps = ({ userState, summitState, settingState }) => ({
  user: userState,
  summit: summitState.summit,
  homeSettings: settingState.homeSettings
});

export default connect(mapStateToProps, { getDisqusSSO, getUserProfile } )(HomePage);