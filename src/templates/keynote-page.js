import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import envVariables from '../utils/envVariables';
import SummitObject from '../content/summit.json'

import Layout from '../components/Layout'

import DisqusComponent from '../components/DisqusComponent'
import VideoComponent from '../components/VideoComponent'
import TalkComponent from '../components/TalkComponent'
import HeaderKeynote from '../components/HeaderKeynote'
import HeroComponent from '../components/HeroComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'

import { getEventBySlug } from '../actions/event-actions'
import { getDisqusSSO } from '../actions/user-actions'

import { PHASES } from '../utils/phasesUtils';

import { AttendanceTracker } from "openstack-uicore-foundation/lib/components";

export const KeynotePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      firstRender: true
    }

    this.onEventChange = this.onEventChange.bind(this);
  }

  componentWillMount() {
    this.props.getDisqusSSO();
    this.props.getEventBySlug(this.props.eventId);
  }

  componentDidMount() {
    this.setState({ firstRender: false })
  }

  onEventChange(ev) {
    const { eventId } = this.props;
    if (eventId !== `${ev.id}`) {
      navigate(`/a/keynote/${ev.id}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { eventId } = this.props;
    if (eventId !== nextProps.eventId) {
      this.props.getEventBySlug(nextProps.eventId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.loading !== nextProps.loading) return true;
    if (this.props.eventId !== nextProps.eventId) return true;
    if (this.props.event?.id !== nextProps.event?.id) return true;
    if (this.props.eventsPhases !== nextProps.eventsPhases) return true;
    return false
  }

  render() {
    const { loggedUser, event, eventsPhases, user, loading } = this.props;
    const { firstRender } = this.state;
    let { summit } = SummitObject;
    let currentEvent = eventsPhases.find(e => e.id === event?.id);
    let eventStarted = currentEvent && currentEvent.phase !== null ? currentEvent.phase : null;

    if (!firstRender && !loading && !event) {
      return <HeroComponent title="Event not found" redirectTo={`${envVariables.AUTHORIZED_DEFAULT_PATH}`} />
    }

    if (loading || eventStarted === null) {
      return <HeroComponent title="Loading event" />
    } else {
      if (event) {
        return (
          <>
            <HeaderKeynote event={event} />
            <section className="section px-0 py-0" style={{ marginBottom: event.class_name !== 'Presentation' || eventStarted < PHASES.DURING || !event.streaming_url ? '-3rem' : '' }}>
              <div className="columns is-gapless">
                {eventStarted >= PHASES.DURING && event.streaming_url ?
                  <div className="column is-full px-0 py-0">
                    <VideoComponent url={event.streaming_url} title={event.title} />
                    {event.meeting_url &&
                      <div className="join-zoom-container">
                        <span>
                          Take the virtual mic and participate!
                        </span>
                        <a className="zoom-link" href={event.meeting_url} target="_blank">
                          <button className="zoom-button button">
                            <b>Join now</b>
                          </button>
                        </a>
                        <a target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        </a>
                      </div>
                    }
                  </div>
                  :
                  <div className="column is-full px-0 py-0">
                    <TalkComponent eventStarted={eventStarted} event={event} summit={summit} noStream={true} />
                  </div>
                }
              </div>
            </section>
            <section className="section px-0 pt-5 pb-0">
              <div className="columns mt-5">
                <div className="column px-0 pt-5 pb-0 is-three-quarters">
                  <DisqusComponent disqusSSO={user.disqusSSO} page='keynote' event={event} summit={summit} title="Public Conversations" />                  
                </div>
                <div className="column px-5 pt-5 pb-0 is-one-quarter">
                  <AdvertiseComponent section='keynote' column="right" style={{ marginTop: '2em' }} />
                </div>
              </div>
            </section>
          </>
        )
      } else {
        return <HeroComponent title="Loading event" />
      }
    }
  }
}

const KeynotePage = (
  {
    loggedUser,
    loading,
    event,
    eventId,
    user,
    eventsPhases,
    getEventBySlug,
    getDisqusSSO
  }
) => {

  return (
    <Layout>
      {event && event.id &&
        <AttendanceTracker
          key={`att-tracker-${event.id}`}
          eventId={event.id}
          summitId={SummitObject.summit.id}
          apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
          accessToken={loggedUser.accessToken}
        />
      }
      <KeynotePageTemplate
        loggedUser={loggedUser}
        event={event}
        loading={loading}
        eventId={eventId}
        user={user}
        eventsPhases={eventsPhases}
        getEventBySlug={getEventBySlug}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

KeynotePage.propTypes = {
  loggedUser: PropTypes.object,
  loading: PropTypes.bool,
  event: PropTypes.object,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventBySlug: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

KeynotePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  event: PropTypes.object,
  loading: PropTypes.bool,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventBySlug: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = (
  {
    loggedUserState,
    eventState,
    userState,
    clockState,
  }
) => ({

  loggedUser: loggedUserState,
  loading: eventState.loading,
  event: eventState.event,
  eventsPhases: clockState.events_phases,
  user: userState,
})

export default connect(
  mapStateToProps,
  {
    getEventBySlug,
    getDisqusSSO
  }
)(KeynotePage);