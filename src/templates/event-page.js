import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import envVariables from '../utils/envVariables';
import SummitObject from '../content/summit.json'

import Layout from '../components/Layout'

import DisqusComponent from '../components/DisqusComponent'
import Etherpad from '../components/Etherpad'
import SimpleChatWidgetComponent from '../components/SimpleChatWidgetComponent'
import VideoComponent from '../components/VideoComponent'
import TalkComponent from '../components/TalkComponent'
import DocumentsComponent from '../components/DocumentsComponent'
import EventHeroComponent from '../components/EventHeroComponent'
import NoTalkComponent from '../components/NoTalkComponent'
import HeroComponent from '../components/HeroComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'

import { getEventById } from '../actions/event-actions'
import { getDisqusSSO } from '../actions/user-actions'

import { PHASES } from '../utils/phasesUtils';

import { AttendanceTracker } from "openstack-uicore-foundation/lib/components";

export const EventPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      firstRender: true
    }

    this.onEventChange = this.onEventChange.bind(this);
    this.onViewAllEventsClick = this.onViewAllEventsClick.bind(this);
  }

  componentWillMount() {
    this.props.getDisqusSSO();
    this.props.getEventById(this.props.eventId);
  }

  componentDidMount() {
    this.setState({ firstRender: false })
  }

  onEventChange(ev) {
    const { eventId } = this.props;
    if (eventId !== `${ev.id}`) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  onViewAllEventsClick() {
    navigate('/a/schedule')
  }

  componentWillReceiveProps(nextProps) {
    const { eventId } = this.props;
    if (eventId !== nextProps.eventId) {
      this.props.getEventById(nextProps.eventId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading, eventId, event, eventsPhases } = this.props;
    if (loading !== nextProps.loading) return true;
    if (eventId !== nextProps.eventId) return true;
    if (event?.id !== nextProps.event?.id) return true;
    const currentPhase = eventsPhases.find(e => e.id == eventId)?.phase;
    const nextCurrentPhase = nextProps.eventsPhases.find(e => e.id == eventId)?.phase;
    if (currentPhase !== nextCurrentPhase && !(currentPhase === 0 && nextCurrentPhase === 1)) return true;
    return false
  }

  render() {
    const { loggedUser, event, eventId, eventsPhases, user, loading } = this.props;
    const { firstRender } = this.state;
    let { summit } = SummitObject;
    let currentEvent = eventsPhases.find(e => e.id == eventId);
    let eventStarted = currentEvent && currentEvent.phase !== null ? currentEvent.phase : null;

    if (!firstRender && !loading && !event) {
      return <HeroComponent title="Event not found" redirectTo="/a/schedule" />
    }

    if (loading || eventStarted === null) {
      return <HeroComponent title="Loading event" />
    } else {
      if (event) {
        return (
          <>
            {/* <EventHeroComponent /> */}
            <section className="section px-0 py-0" style={{ marginBottom: event.class_name !== 'Presentation' || eventStarted < PHASES.DURING || !event.streaming_url ? '-3rem' : '' }}>
              <div className="columns is-gapless">
                {eventStarted >= PHASES.DURING && event.streaming_url ?
                  <div className="column is-three-quarters px-0 py-0">
                    <VideoComponent url={event.streaming_url} title={event.title} namespace={summit.name} />
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
                  <>
                    <div className="column is-three-quarters px-0 py-0 is-hidden-mobile">
                      <NoTalkComponent eventStarted={eventStarted} event={event} summit={summit} />
                    </div>
                    <div className="column is-hidden-tablet">
                      <NoTalkComponent eventStarted={eventStarted} event={event} summit={summit} />
                    </div>
                  </>
                }
                <div className="column" style={{ position: 'relative', borderBottom: '1px solid #d3d3d3' }}>
                  <DisqusComponent disqusSSO={user.disqusSSO} event={event} summit={summit} title="Public Conversation" />
                </div>
              </div>
            </section>
            {eventStarted >= PHASES.DURING && event.streaming_url &&
              <section className="section px-0 pt-5 pb-0">
                <div className="columns mx-0 my-0 is-multiline">
                  <div className="column px-0 py-0 is-three-quarters is-hidden-mobile">
                    <TalkComponent eventStarted={eventStarted} event={event} summit={summit} />
                  </div>
                  <DocumentsComponent event={event} />
                  {event.etherpad_link &&
                    <div className="column is-three-quarters">
                      <Etherpad className="talk__etherpad" etherpad_link={event.etherpad_link} userName={user.userProfile.first_name} />
                    </div>
                  }
                  <div className="column is-one-quarter" style={{ marginLeft: 'auto' }}>
                    <SimpleChatWidgetComponent accessToken={loggedUser.accessToken} />
                  </div>
                  <div className="column is-three-quarters">
                    <ScheduleLiteComponent
                      accessToken={loggedUser.accessToken}
                      onEventClick={(ev) => this.onEventChange(ev)}
                      onViewAllEventsClick={() => this.onViewAllEventsClick()}
                      landscape={false}
                      showDetails={false}
                      yourSchedule={false}
                      showFilters={false}
                      showNav={false}
                      trackId={event.track ? event.track.id : null}
                      eventCount={3}
                      title={event.track ? `Happening Now on ${event.track.name}` : 'Happening Now'}
                    />
                  </div>
                </div>
              </section>
            }
          </>
        )
      } else {
        return <HeroComponent title="Loading event" />
      }
    }
  }
}

const EventPage = (
  {
    loggedUser,
    loading,
    event,
    eventId,
    user,
    eventsPhases,
    getEventById,
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
      <EventPageTemplate
        loggedUser={loggedUser}
        event={event}
        loading={loading}
        eventId={eventId}
        user={user}
        eventsPhases={eventsPhases}
        getEventById={getEventById}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

EventPage.propTypes = {
  loggedUser: PropTypes.object,
  loading: PropTypes.bool,
  event: PropTypes.object,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventById: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

EventPageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  event: PropTypes.object,
  loading: PropTypes.bool,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventById: PropTypes.func,
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
    getEventById,
    getDisqusSSO
  }
)(EventPage);