import React from "react";
import PropTypes from "prop-types";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import DisqusComponent from "../components/DisqusComponent";
import AdvertiseComponent from "../components/AdvertiseComponent";
import Etherpad from "../components/Etherpad";
import VideoComponent from "../components/VideoComponent";
import TalkComponent from "../components/TalkComponent";
import DocumentsComponent from "../components/DocumentsComponent";
import VideoBanner from "../components/VideoBanner";
import SponsorComponent from "../components/SponsorComponent";
import NoTalkComponent from "../components/NoTalkComponent";
import HeroComponent from "../components/HeroComponent";
import UpcomingEventsComponent from "../components/UpcomingEventsComponent";
import AccessTracker, { AttendeesWidget } from "../components/AttendeeToAttendeeWidgetComponent"
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import { PHASES } from '../utils/phasesUtils';
import { getEventById } from "../actions/event-actions";
import { getDisqusSSO } from "../actions/user-actions";
import URI from "urijs"

export const EventPageTemplate = class extends React.Component {

  componentDidMount() {
    const { eventId,event } = this.props;
    this.props.getDisqusSSO();
    if(parseInt(event?.id) !== parseInt(eventId))
      this.props.getEventById(eventId);
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { eventId, event } = this.props;
    const { eventId: prevEventId } = prevProps;
    // event id could came as param at uri
    if (parseInt(eventId) !== parseInt(prevEventId) || parseInt(event?.id) !== parseInt(eventId) ) {
      this.props.getEventById(eventId);
    }
  }

  onEventChange(ev) {
    const { eventId } = this.props;
    if (parseInt(eventId) !== parseInt(ev.id)) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  onViewAllEventsClick() {
    navigate("/a/schedule");
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading, eventId, event, eventsPhases } = this.props;
    if (loading !== nextProps.loading) return true;
    if (eventId !== nextProps.eventId) return true;
    if (event?.id !== nextProps.event?.id) return true;
    // compare current event phase with next one
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(eventId))?.phase;
    const nextCurrentPhase = nextProps.eventsPhases.find(
        (e) => parseInt(e.id) === parseInt(eventId)
    )?.phase;
    const finishing = (currentPhase === PHASES.DURING && nextCurrentPhase === PHASES.AFTER);
    return (currentPhase !== nextCurrentPhase && !finishing);
  }

  canRenderVideo = (currentPhase) => {
    const {event} = this.props;
    return (currentPhase >= PHASES.DURING || event.streaming_type === 'VOD') && event.streaming_url;
  };

  render() {

    const { event, user, loading, nowUtc, summit, eventsPhases, eventId, location } = this.props;
    // get current event phase
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(eventId))?.phase;
    const firstHalf = currentPhase === PHASES.DURING ? nowUtc < ((event?.start_date + event?.end_date) / 2) : false;
    const query = URI.parseQuery(location.search);

    // if event is loading or we are still calculating the current phase ...
    if (loading || currentPhase === undefined) {
      return <HeroComponent title="Loading event" />;
    }

    if (!event) {
      return <HeroComponent title="Event not found" redirectTo="/a/schedule" />;
    }

    return (
          <React.Fragment>
            {/* <EventHeroComponent /> */}
            <section
              className="section px-0 py-0"
              style={{
                marginBottom:
                  event.class_name !== "Presentation" ||
                  currentPhase < PHASES.DURING  ||
                  !event.streaming_url
                    ? "-3rem"
                    : "",
              }}
            >
              <div className="columns is-gapless">
                {this.canRenderVideo(currentPhase) ? (
                  <div className="column is-three-quarters px-0 py-0">
                    <VideoComponent
                      url={event.streaming_url}
                      title={event.title}
                      namespace={summit.name}
                      firstHalf={firstHalf}
                      autoPlay={query.autostart === 'true'}
                    />
                    {event.meeting_url && <VideoBanner event={event} />}
                  </div>
                ) : (
                  <div className="column is-three-quarters px-0 py-0 is-full-mobile">
                    <NoTalkComponent
                      currentEventPhase={currentPhase}
                      event={event}
                      summit={summit}
                    />
                  </div>
                )}
                <div
                  className="column is-hidden-mobile"
                  style={{
                    position: "relative",
                    borderBottom: "1px solid #d3d3d3",
                  }}
                >
                  <DisqusComponent
                    hideMobile={true}
                    disqusSSO={user.disqusSSO}
                    event={event}
                    summit={summit}
                    title="Public Conversation"
                  />
                </div>
              </div>
            </section>
              <section className="section px-0 pt-5 pb-0">
                <div className="columns mx-0 my-0">
                  <div className="column is-three-quarters is-full-mobile">
                    <div className="px-5 py-5">
                      <TalkComponent
                        currentEventPhase={currentPhase}
                        event={event}
                        summit={summit}
                      />
                    </div>
                    <div className="px-5 py-0">
                      <SponsorComponent page="event" />
                    </div>
                    <div className="is-hidden-tablet">
                      <DisqusComponent
                        hideMobile={false}
                        disqusSSO={user.disqusSSO}
                        event={event}
                        summit={summit}
                        title="Public Conversation"
                      />
                      ∆
                    </div>
                    {event.etherpad_link && (
                      <div className="column is-three-quarters">
                        <Etherpad
                          className="talk__etherpad"
                          etherpad_link={event.etherpad_link}
                          userName={user.userProfile.first_name}
                        />
                      </div>
                    )}
                    <UpcomingEventsComponent
                      onEventClick={(ev) => this.onEventChange(ev)}
                      onViewAllEventsClick={() => this.onViewAllEventsClick()}
                      trackId={event.track ? event.track.id : null}
                      eventCount={3}
                      title={
                        event.track
                          ? `Up Next on ${event.track.name}`
                          : "Up Next"
                      }
                    />
                  </div>
                  <div className="column px-0 py-0 is-one-quarter is-full-mobile">
                    <DocumentsComponent event={event} />
                    <AccessTracker />
                    <AttendeesWidget user={user} event={event} />
                    <AdvertiseComponent section="event" column="right" />
                  </div>
                </div>
              </section>
          </React.Fragment>
        );
    }
};

const EventPage = ({
  summit,
  location,
  loading,
  event,
  eventId,
  user,
  eventsPhases,
  nowUtc,
  getEventById,
  getDisqusSSO,
}) => {
  return (
    <Layout location={location}>
      {event && event.id && (
        <AttendanceTrackerComponent
          key={`att-tracker-${event.id}`}
          sourceId={event.id}
          sourceName="EVENT"
        />
      )}
      <EventPageTemplate
        summit={summit}
        event={event}
        eventId={eventId}
        loading={loading}
        user={user}
        eventsPhases={eventsPhases}
        nowUtc={nowUtc}
        location={location}
        getEventById={getEventById}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  );
};

EventPage.propTypes = {
  loading: PropTypes.bool,
  event: PropTypes.object,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventById: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

EventPageTemplate.propTypes = {
  event: PropTypes.object,
  loading: PropTypes.bool,
  eventId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getEventById: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

const mapStateToProps = ({eventState, summitState, userState, clockState}) => ({
  loading: eventState.loading,
  event: eventState.event,
  user: userState,
  summit: summitState.summit,
  eventsPhases: clockState.events_phases,
  nowUtc: clockState.nowUtc,
});

export default connect(mapStateToProps, {
  getEventById,
  getDisqusSSO,
})(EventPage);