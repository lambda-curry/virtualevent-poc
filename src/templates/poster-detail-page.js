import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';

import Layout from "../components/Layout";
import HeroComponent from '../components/HeroComponent';
import DisqusComponent from '../components/DisqusComponent';
import VideoComponent from '../components/VideoComponent';
import PosterButton from '../components/PosterButton';
import PosterDescription from '../components/PosterDescription';
import PosterLiveSession from '../components/PosterLiveSession';
import PosterNavigation from '../components/PosterNavigation';
import PosterImage from '../components/PosterImage';
import PosterGrid from '../components/poster-grid';
import DocumentsComponent from '../components/DocumentsComponent';
import AdvertiseComponent from '../components/AdvertiseComponent';
import Etherpad from '../components/Etherpad';
import NotificationHub from '../components/notification-hub';

import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent';
import AccessTracker, { AttendeesWidget } from '../components/AttendeeToAttendeeWidgetComponent';

import { getDisqusSSO } from '../actions/user-actions';
import { getAllVoteablePresentations, getPresentationById, setInitialDataSet } from '../actions/presentation-actions';
import { castPresentationVote, uncastPresentationVote } from '../actions/user-actions';

import { PHASES } from '../utils/phasesUtils';
import { isAuthorizedBadge } from '../utils/authorizedGroups';

export const PosterDetailPage = ({
  location,
  presentationId,
  getDisqusSSO,
  setInitialDataSet,
  getAllVoteablePresentations,
  getPresentationById,
  loading,
  summit,
  user,
  isAuthorized,
  attendee,
  allPosters,
  recommendedPosters,
  votingPeriods,
  votes,
  castPresentationVote,
  uncastPresentationVote
}) => {

  const [poster, setPoster] = useState(null);
  const [userCanViewPoster, setUserCanViewPoster] = useState(null);
  const [posterTrackGroups, setPosterTrackGroups] = useState([]);
  const [notifiedVotingPeriodsOnLoad, setNotifiedVotingPeriodsOnLoad] = useState(false);
  const [notifiedMaximunAllowedVotesOnLoad, setNotifiedMaximunAllowedVotesOnLoad] = useState(false);
  const [previousVotingPeriods, setPreviousVotingPeriods] = useState(votingPeriods);
  const [votedPosterTrackGroups, setVotedPosterTrackGroups] = useState([]);

  const notificationRef = useRef(null);

  const pushNotification = useCallback((notification) => {
    return notificationRef.current?.(notification);
  }, [notificationRef]);

  const toggleVote = useCallback((presentation, isVoted) => {
    setVotedPosterTrackGroups(presentation.track?.track_groups);
    isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
  }, []);

  useEffect(() => {
    getDisqusSSO();
    if (!allPosters.length) setInitialDataSet().then(() => getAllVoteablePresentations());
  }, []);

  useEffect(() => {
    const fetchPresentation = async () => {
      let presentation;
      try {
        presentation = await getPresentationById(presentationId);
        setPoster(presentation);
      } catch (e) {}
    }
    fetchPresentation();
  }, [presentationId]);

  useEffect(() => {
    if (poster) {
      setUserCanViewPoster(isAuthorized || isAuthorizedBadge(poster, user.userProfile.summit_tickets));
      setPosterTrackGroups(poster.track?.track_groups ?? []);
    }
  }, [poster]);

  useEffect(() => {
    if (!notifiedVotingPeriodsOnLoad &&
      posterTrackGroups.length &&
      posterTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
      posterTrackGroups.forEach(tg => {
        if (votingPeriods[tg].phase === PHASES.BEFORE) {
          const startDate = new Date(votingPeriods[tg].startDate * 1000).toLocaleDateString('en-US');
          const startTime = new Date(votingPeriods[tg].startDate * 1000).toLocaleTimeString('en-US');
          pushNotification(`Voting has not begun. ${votingPeriods[tg].name} will allow for votes starting on ${startDate} ${startTime}`);
          setNotifiedVotingPeriodsOnLoad(true);
        } else if (votingPeriods[tg].phase === PHASES.AFTER) {
          const endDate = new Date(votingPeriods[tg].endDate * 1000).toLocaleDateString('en-US');
          const endTime = new Date(votingPeriods[tg].endDate * 1000).toLocaleTimeString('en-US');
          pushNotification(`Voting has ended. ${votingPeriods[tg].name} does not allow for votes after ${endDate} ${endTime}`);
          setNotifiedVotingPeriodsOnLoad(true);
        }
      });
    }
    if (!notifiedMaximunAllowedVotesOnLoad &&
      posterTrackGroups.length &&
      posterTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
      posterTrackGroups.forEach(tg => {
        if (votingPeriods[tg].phase === PHASES.DURING && votingPeriods[tg].remainingVotes === 0) {
          pushNotification(`You've reached your maximum votes. ${votingPeriods[tg].name} only allows for ${votingPeriods[tg].maxAttendeeVotes} votes per attendee`);
          setNotifiedMaximunAllowedVotesOnLoad(true);
        }
      });
    }
    if (votedPosterTrackGroups &&
        votedPosterTrackGroups.length &&
        posterTrackGroups.length &&
        posterTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
        votedPosterTrackGroups.forEach(tg => {
        if (votingPeriods[tg].phase === PHASES.DURING && votingPeriods[tg].remainingVotes === 0) {
          pushNotification(`You've reached your maximum votes. ${votingPeriods[tg].name} only allows for ${votingPeriods[tg].maxAttendeeVotes} votes per attendee`);
          setVotedPosterTrackGroups([]);
        }
      });
    }
    if (posterTrackGroups.length &&
      posterTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined) &&
      posterTrackGroups.map(tg => previousVotingPeriods[tg]).every(vp => vp !== undefined)) {
      posterTrackGroups.forEach(tg => {
        if (previousVotingPeriods[tg].phase === PHASES.BEFORE && votingPeriods[tg].phase === PHASES.DURING) {
          pushNotification(`Voting has now begun! You are allowed ${votingPeriods[tg].maxAttendeeVotes} votes in ${votingPeriods[tg].name}`);
        } else if (previousVotingPeriods[tg].phase === PHASES.DURING && votingPeriods[tg].phase === PHASES.AFTER) {
          const endDate = new Date(votingPeriods[tg].endDate * 1000).toLocaleDateString('en-US');
          const endTime = new Date(votingPeriods[tg].endDate * 1000).toLocaleTimeString('en-US');
          pushNotification(`Voting has ended. ${votingPeriods[tg].name} does not allow for votes after ${endDate} ${endTime}`);
        }
      });
    }
    setPreviousVotingPeriods(votingPeriods);
  }, [posterTrackGroups, votingPeriods]);

  if (loading || userCanViewPoster === null) return <HeroComponent title="Loading poster" />;

  if (!poster) return <HeroComponent title="Poster not found" />;

  if (!userCanViewPoster) {
    return <HeroComponent title={"Sorry. You need a special badge to view this poster."} redirectTo={location.state?.previousUrl || '/a/'} />;
  }

  const mediaUpload = poster.media_uploads?.find((e) => e?.media_upload_type?.name === 'Poster');

  return (
    <>
      <AttendanceTrackerComponent
        key={`att-tracker-${poster.id}`}
        sourceId={poster.id}
        sourceName="POSTER"
      />
      <section
        className="section px-0 py-0"
        style={{ marginBottom: !poster.streaming_url ? 0 : '' }}
      >
        <div className="columns is-gapless">
          <div className="column is-three-quarters px-0 py-0" style={{ position: 'relative' }}>
            {poster.streaming_url &&
              <>
                <VideoComponent
                  url={poster.streaming_url}
                  title={poster.title}
                  namespace={summit.name}
                  autoPlay={false}
                />
                <PosterButton mediaUpload={mediaUpload} />
              </>
            }
            {!poster.streaming_url &&
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
                votingAllowed={!!attendee}
                votingPeriods={votingPeriods}
                votes={votes}
                isVoted={!!votes.find(v => v.presentation_id === poster.id)}
                toggleVote={toggleVote}
              />
            </div>
            <div className="px-5 py-0">
              <PosterNavigation allPosters={allPosters} poster={poster} />
              <div className="mt-5 mb-5 mx-0"><b>More like this</b></div>
              <PosterGrid
                posters={recommendedPosters}
                votingAllowed={!!attendee}
                votingPeriods={votingPeriods}
                votes={votes}
                toggleVote={toggleVote}
                showDetailPage={(posterId) => navigate(`/a/poster/${posterId}`)}
              />
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
            {poster.etherpad_link && (
              <div className="column is-three-quarters">
                <Etherpad
                  className="talk__etherpad"
                  etherpad_link={poster.etherpad_link}
                  userName={user.userProfile.first_name}
                />
              </div>
            )}
          </div>
          <div className="column px-0 py-0 is-one-quarter is-full-mobile">
            {!poster.meeting_url && <PosterLiveSession poster={poster} />}
            <DocumentsComponent event={poster} />
            <AccessTracker />
            <AttendeesWidget user={user} event={poster} />
            <AdvertiseComponent section="event" column="right" />
          </div>
        </div>
        <NotificationHub children={(add) => { notificationRef.current = add }} />
      </section>
    </>
  );
};

const PosterDetailPageTemplate = ({
  location,
  presentationId,
  getDisqusSSO,
  setInitialDataSet,
  getAllVoteablePresentations,
  getPresentationById,
  loading,
  summit,
  user,
  isAuthorized,
  attendee,
  allPosters,
  recommendedPosters,
  votingPeriods,
  votes,
  castPresentationVote,
  uncastPresentationVote
}) => {
  return (
    <Layout location={location}>
      <PosterDetailPage
        location={location}
        presentationId={presentationId}
        getDisqusSSO={getDisqusSSO}
        setInitialDataSet={setInitialDataSet}
        getAllVoteablePresentations={getAllVoteablePresentations}
        getPresentationById={getPresentationById}
        loading={loading}
        summit={summit}
        user={user}
        isAuthorized={isAuthorized}
        attendee={attendee}
        allPosters={allPosters}
        recommendedPosters={recommendedPosters}
        votingPeriods={votingPeriods}
        votes={votes}
        castPresentationVote={castPresentationVote}
        uncastPresentationVote={uncastPresentationVote}
      />
    </Layout>
  );
};

const posterDetailPageTemplatePropTypes = {
  location: PropTypes.object,
  presentationId: PropTypes.string,
  getDisqusSSO: PropTypes.func,
  setInitialDataSet: PropTypes.func,
  getAllVoteablePresentations: PropTypes.func,
  getPresentationById: PropTypes.func,
  loading: PropTypes.bool,
  summit: PropTypes.object,
  user: PropTypes.object,
  isAuthorized: PropTypes.bool,
  attendee: PropTypes.object,
  allPosters: PropTypes.array,
  recommendedPosters: PropTypes.array,
  votingPeriods: PropTypes.object,
  votes: PropTypes.array,
  castPresentationVote: PropTypes.func,
  uncastPresentationVote: PropTypes.func,
};

PosterDetailPage.propTypes = posterDetailPageTemplatePropTypes;
PosterDetailPageTemplate.propTypes = posterDetailPageTemplatePropTypes;

const mapStateToProps = ({ userState, summitState, presentationsState }) => ({
  loading: presentationsState.voteablePresentations.loading,
  summit: summitState.summit,
  user: userState,
  isAuthorized: userState.isAuthorized,
  attendee: userState.attendee,
  allPosters: presentationsState.voteablePresentations.allPresentations,
  recommendedPosters: presentationsState.voteablePresentations.recommendedPresentations,
  votingPeriods: presentationsState.votingPeriods,
  votes: userState.attendee?.presentation_votes ?? []
});

export default connect(mapStateToProps, {
  getPresentationById,
  getDisqusSSO,
  setInitialDataSet,
  getAllVoteablePresentations,
  castPresentationVote,
  uncastPresentationVote
})(PosterDetailPageTemplate);