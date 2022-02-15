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
import PosterLiveSession from "../components/PosterLiveSession";
import PosterNavigation from "../components/PosterNavigation";
import PosterButton from "../components/PosterButton";
import HeroComponent from "../components/HeroComponent";
import AccessTracker, { AttendeesWidget } from "../components/AttendeeToAttendeeWidgetComponent"
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import { PHASES } from '../utils/phasesUtils';
import { getPosterById } from "../actions/poster-actions";
import { getDisqusSSO } from "../actions/user-actions";
import URI from "urijs"

export const PosterDetailPageTemplate = class extends React.Component {
    
  componentDidMount() {
    const { presentationId } = this.props;
    this.props.getDisqusSSO();
    this.props.getPosterById(presentationId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { presentationId, poster } = this.props;
    const { presentationId: prevPresentationId } = prevProps;
    // event id could came as param at uri
    if (presentationId !== prevPresentationId || (poster?.id !== parseInt(presentationId))) {
      this.props.getPosterById(presentationId);
    }
  }

  onEventChange(ev) {
    const { presentationId } = this.props;
    if (parseInt(presentationId) !== parseInt(ev.id)) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading, presentationId, poster, eventsPhases } = this.props;
    if (loading !== nextProps.loading) return true;
    if (presentationId !== nextProps.presentationId) return true;
    if (poster?.id !== nextProps.event?.id) return true;
    // compare current event phase with next one
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(presentationId))?.phase;
    const nextCurrentPhase = nextProps.eventsPhases.find(
        (e) => parseInt(e.id) === parseInt(presentationId)
    )?.phase;
    const finishing = (currentPhase === PHASES.DURING && nextCurrentPhase === PHASES.AFTER);
    return (currentPhase !== nextCurrentPhase && !finishing);
  }

  canRenderVideo = (currentPhase) => {
    const {poster} = this.props;
    return (currentPhase >= PHASES.DURING || poster.streaming_type === 'VOD') && poster.streaming_url;
  };

  render() {

    const { poster, event, user, loading, nowUtc, summit, eventsPhases, presentationId, location } = this.props;
    // get current event phase
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(presentationId))?.phase;
    const firstHalf = currentPhase === PHASES.DURING ? nowUtc < ((event?.start_date + event?.end_date) / 2) : false;
    const query = URI.parseQuery(location.search);

    // if event is loading or we are still calculating the current phase ...
    if (loading) {
      return <HeroComponent title="Loading event" />;

    }

    if (!poster) {
      return <HeroComponent title="Poster not found" />;
    }


    return (
          <React.Fragment>
            {/* <EventHeroComponent /> */}
            <section
              className="section px-0 py-0"
              style={{
                marginBottom:
                  poster?.class_name !== "Presentation" ||
                  currentPhase < PHASES.DURING  ||
                  !poster?.streaming_url
                    ? "-3rem"
                    : "",
              }}
            >
              <div className="columns is-gapless">
                <div className="column is-three-quarters px-0 py-0" style={{position: 'relative'}}>
                <VideoComponent
                    url={poster?.streaming_url}
                    title={poster?.title}
                    namespace={summit.name}
                    firstHalf={firstHalf}
                    autoPlay={query.autostart === 'true'}
                />
                <PosterButton poster={poster} />
                </div>
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
                    event={poster}
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
                        event={poster}
                        summit={summit}
                      />
                    </div>
                    <div className="px-5 py-0">
                      <PosterNavigation />
                    </div>
                    <div className="is-hidden-tablet">
                      <DisqusComponent
                        hideMobile={false}
                        disqusSSO={user.disqusSSO}
                        event={poster}
                        summit={summit}
                        title="Public Conversation"
                      />
                      ∆
                    </div>
                    {poster?.etherpad_link && (
                      <div className="column is-three-quarters">
                        <Etherpad
                          className="talk__etherpad"
                          etherpad_link={poster?.etherpad_link}
                          userName={user.userProfile.first_name}
                        />
                      </div>
                    )}
                  </div>
                  <div className="column px-0 py-0 is-one-quarter is-full-mobile">
                  {!poster?.meeting_url && <PosterLiveSession poster={poster} />}
                    <DocumentsComponent event={poster} />
                    {/* <AccessTracker />
                    <AttendeesWidget user={user} event={poster} /> */}
                    <AdvertiseComponent section="event" column="right" />
                  </div>
                </div>
              </section>
          </React.Fragment>
        );
    }
};

const PosterDetailPage = ({
  summit,
  location,
  loading,
  poster,
  presentationId,
  user,
  eventsPhases,
  nowUtc,
  getPosterById,
  getDisqusSSO,
}) => {
  return (
    <Layout location={location}>
      {poster && poster.id && (
        <AttendanceTrackerComponent
          key={`att-tracker-${poster.id}`}
          sourceId={poster.id}
          sourceName="EVENT"
        />
      )}
      <PosterDetailPageTemplate
        summit={summit}
        poster={poster}
        presentationId={presentationId}
        loading={loading}
        user={user}
        eventsPhases={eventsPhases}
        nowUtc={nowUtc}
        location={location}
        getPosterById={getPosterById}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  );
};

PosterDetailPage.propTypes = {
  loading: PropTypes.bool,
  poster: PropTypes.object,
  presentationId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getPosterById: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

PosterDetailPageTemplate.propTypes = {
  poster: PropTypes.object,
  loading: PropTypes.bool,
  presentationId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getPosterById: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

const mapStateToProps = ({posterState, summitState, userState, clockState}) => ({
  loading: posterState.loading,
  poster: posterState.poster,
  user: userState,
  summit: summitState.summit,
  eventsPhases: clockState.events_phases,
  nowUtc: clockState.nowUtc,
});

export default connect(mapStateToProps, {
  getPosterById,
  getDisqusSSO,
})(PosterDetailPage);