import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import DisqusComponent from "../components/DisqusComponent";
import AdvertiseComponent from "../components/AdvertiseComponent";
import Etherpad from "../components/Etherpad";
import VideoComponent from "../components/VideoComponent";
import PosterDescription from "../components/PosterDescription";
import DocumentsComponent from "../components/DocumentsComponent";
import PosterLiveSession from "../components/PosterLiveSession";
import PosterNavigation from "../components/PosterNavigation";
import PosterButton from "../components/PosterButton";
import HeroComponent from "../components/HeroComponent";
import PosterGrid from "../components/poster-grid";
import { PHASES } from '../utils/phasesUtils';
import { getAllVoteablePresentations, getPresentationById, setInitialDataSet } from "../actions/presentation-actions";
import { castPresentationVote, uncastPresentationVote } from '../actions/user-actions';
import { getDisqusSSO } from "../actions/user-actions";
import URI from "urijs"
import PosterImage from "../components/PosterImage";
import AccessTracker, { AttendeesWidget } from "../components/AttendeeToAttendeeWidgetComponent"
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";
import { isAuthorizedBadge } from "../utils/authorizedGroups";

export const PosterDetailPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);
    this.toggleVote = this.toggleVote.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
  }

  componentDidMount() {
    const { presentationId, allPosters, setInitialDataSet, getAllVoteablePresentations } = this.props;
    this.props.getDisqusSSO();
    this.props.getPresentationById(presentationId);
    if (!allPosters.length) {
      console.log('PosterDetailPageTemplate::componentDidMount loading all presentations')
      setInitialDataSet().then(() => getAllVoteablePresentations());
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { presentationId, poster } = this.props;
    const { presentationId: prevPresentationId } = prevProps;
    if (presentationId !== prevPresentationId || (poster?.id && poster.id !== parseInt(presentationId))) {
      this.props.getPresentationById(presentationId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading, presentationId, poster, eventsPhases, recommendedPosters, votes } = this.props;
    if (loading !== nextProps.loading) return true;
    if (presentationId !== nextProps.presentationId) return true;
    if (poster?.id !== nextProps.poster?.id) return true;
    if (recommendedPosters?.length !== nextProps.recommendedPosters?.length) return true;
    if (votes?.length !== nextProps.votes?.length) return true;
    // compare current event phase with next one
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(presentationId))?.phase;
    const nextCurrentPhase = nextProps.eventsPhases.find(
      (e) => parseInt(e.id) === parseInt(presentationId)
    )?.phase;
    const finishing = (currentPhase === PHASES.DURING && nextCurrentPhase === PHASES.AFTER);
    return (currentPhase !== nextCurrentPhase && !finishing);
  }

  toggleVote(presentation, isVoted) {
    isVoted ? this.props.castPresentationVote(presentation) : this.props.uncastPresentationVote(presentation);
  };

  goToDetails(id) {
    navigate(`/a/poster/${id}`)
  }

  render() {

    const {
      poster,
      event,
      user,
      loading,
      nowUtc,
      summit,
      eventsPhases,
      presentationId,
      location,
      allPosters,
      votes,
      recommendedPosters,
      isAuthorized,
      hasTicket,
    } = this.props;
    // get current event phase
    const currentPhase = eventsPhases.find((e) => parseInt(e.id) === parseInt(presentationId))?.phase;
    const firstHalf = currentPhase === PHASES.DURING ? nowUtc < ((event?.start_date + event?.end_date) / 2) : false;
    const query = URI.parseQuery(location.search);

    // if event is loading or we are still calculating the current phase ...
    if (loading) {
      return <HeroComponent title="Loading Poster" />;
    }

    if (!poster) {
      return <HeroComponent title="Poster not found" />;
    }

    // authz ( todo : refactor WithBadgeRoute to be more generic)
    const hasBadgeForEvent = isAuthorized || (poster.id && user?.userProfile && isAuthorizedBadge(poster, user?.userProfile?.summit_tickets));
    const userIsAuthz = hasTicket || isAuthorized;

    if (!userIsAuthz || !hasBadgeForEvent) {
      return <HeroComponent title={"Sorry. You need a special badge to view this session."} redirectTo={location.state?.previousUrl || "/"} />;
    }

    let mediaUpload = poster?.media_uploads.find((e) => e?.media_upload_type?.name === 'Poster');

    return (
      <React.Fragment>
        {/* <EventHeroComponent /> */}
        <section
          className="section px-0 py-0"
          style={{
            marginBottom:
              !poster?.streaming_url
                ? "0"
                : "",
          }}
        >
          <div className="columns is-gapless">
            <div className="column is-three-quarters px-0 py-0" style={{ position: 'relative' }}>
              {poster?.streaming_url &&
                <>
                  <VideoComponent
                    url={poster?.streaming_url}
                    title={poster?.title}
                    namespace={summit.name}
                    firstHalf={firstHalf}
                    autoPlay={query.autostart === 'true'}
                  />
                  <PosterButton mediaUpload={mediaUpload} />
                </>
              }
              {!poster?.streaming_url &&
                <>
                  <PosterImage mediaUpload={mediaUpload} />
                  <PosterButton mediaUpload={mediaUpload} />
                </>
              }
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
              <div className="px-5 py-0">
                <PosterDescription
                  poster={poster}
                  isVoted={!!votes.find(v => v.presentation_id === poster.id)}
                  toggleVote={this.toggleVote}
                />
              </div>
              <div className="px-5 py-0">
                <PosterNavigation allPosters={allPosters} poster={poster} />
                <div className="mt-5 mb-5 mx-0"><b>More like this</b></div>
                <PosterGrid posters={recommendedPosters} canVote={true} votes={votes} toggleVote={this.toggleVote} showDetailPage={this.goToDetails} showDetail={true}/>
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
              {poster?.meeting_url && <PosterLiveSession poster={poster} />}
              <DocumentsComponent event={poster} />
              <AccessTracker />
              <AttendeesWidget user={user} event={poster} />
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
  getPresentationById,
  castPresentationVote,
  uncastPresentationVote,
  getDisqusSSO,
  allPosters,
  recommendedPosters,
  votes,
  setInitialDataSet,
  getAllVoteablePresentations,
  hasTicket,
  isAuthorized,
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
        getPresentationById={getPresentationById}
        castPresentationVote={castPresentationVote}
        uncastPresentationVote={uncastPresentationVote}
        getDisqusSSO={getDisqusSSO}
        allPosters={allPosters}
        recommendedPosters={recommendedPosters}
        votes={votes}
        setInitialDataSet={setInitialDataSet}
        getAllVoteablePresentations={getAllVoteablePresentations}
        hasTicket={hasTicket}
        isAuthorized={isAuthorized}
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
  getPresentationById: PropTypes.func,
  castPresentationVote: PropTypes.func,
  uncastPresentationVote: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

PosterDetailPageTemplate.propTypes = {
  poster: PropTypes.object,
  loading: PropTypes.bool,
  presentationId: PropTypes.string,
  user: PropTypes.object,
  eventsPhases: PropTypes.array,
  getPresentationById: PropTypes.func,
  castPresentationVote: PropTypes.func,
  uncastPresentationVote: PropTypes.func,
  getDisqusSSO: PropTypes.func,
};

const mapStateToProps = ({ summitState, userState, clockState, presentationsState }) => ({
  loading: presentationsState.voteablePresentations.loading,
  poster: presentationsState.voteablePresentations.detailedPresentation,
  user: userState,
  hasTicket: userState.hasTicket,
  isAuthorized: userState.isAuthorized,
  summit: summitState.summit,
  eventsPhases: clockState.events_phases,
  nowUtc: clockState.nowUtc,
  allPosters: presentationsState.voteablePresentations.allPresentations,
  recommendedPosters: presentationsState.voteablePresentations.recommendedPresentations,
  votes: userState.attendee?.presentation_votes ?? [],
});

export default connect(mapStateToProps, {
  getPresentationById,
  getDisqusSSO,
  castPresentationVote,
  uncastPresentationVote,
  setInitialDataSet,
  getAllVoteablePresentations,
})(PosterDetailPage);