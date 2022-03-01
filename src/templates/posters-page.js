import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { navigate } from "gatsby";
import Layout from '../components/Layout';
import PageHeader from '../components/page-header';
import PosterGrid from '../components/poster-grid';
import ScheduleFilters from '../components/ScheduleFilters';
import PosterHeaderFilter from '../components/poster-header-filter';
import FilterButton from '../components/FilterButton';
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent';
import NotificationHub from '../components/notification-hub';

import {
  setInitialDataSet,
  getAllVoteablePresentations,
  updateFilter
} from '../actions/presentation-actions';

import {
  castPresentationVote,
  uncastPresentationVote
} from '../actions/user-actions';

import { filterByTrackGroup, randomSort } from '../utils/filterUtils';
import { PHASES } from '../utils/phasesUtils';

import styles from '../styles/posters-page.module.scss';

const SCROLL_DIRECTION = {
  UP: 'scrolling up',
  DOWN: 'scrolling down'
};

const PostersPage = ({
  location,
  trackGroupId,
  pagesSettings,
  setInitialDataSet,
  getAllVoteablePresentations,
  posters,
  allPosters,
  castPresentationVote,
  uncastPresentationVote,
  votingPeriods,
  attendee,
  votes,
  summit,
  allBuildTimePosters,
  filters,
  updateFilter,
  colorSettings,
}) => {

  const [pageSettings] = useState(pagesSettings.find(ps => ps.trackGroupId === parseInt(trackGroupId)));
  const [allBuildTimePostersByTrackGroup, setAllBuildTimePostersByTrackGroup] = useState(allBuildTimePosters);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedPageFilter, setAppliedPageFilter] = useState(null);
  const [filteredPosters, setFilteredPosters] = useState(posters);
  const [pageTrackGroups, setPageTrackGroups] = useState([]);
  const [notifiedMaximunAllowedVotesOnLoad, setNotifiedMaximunAllowedVotesOnLoad] = useState(false);
  const [notifiedVotingPeriodsOnLoad, setNotifiedVotingPeriodsOnLoad] = useState(false);
  const [previousVotingPeriods, setPreviousVotingPeriods] = useState(votingPeriods);
  const [votedPosterTrackGroups, setVotedPosterTrackGroups] = useState([]);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [mustScrollFiltersDown, setMustScrollFiltersDown] = useState(false);

  const notificationRef = useRef(null);
  const filtersWrapperRef = useRef(null);

  const pushNotification = (notification) => {
    return notificationRef.current?.(notification);
  }

  useEffect(() => {
    if (scrollDirection === SCROLL_DIRECTION.UP) {
      filtersWrapperRef.current.scroll({ top: 0, behavior: 'smooth' });
    }
    const threshold = 100;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      let scrollDirection = scrollY > lastScrollY ? SCROLL_DIRECTION.DOWN : SCROLL_DIRECTION.UP;
      setScrollDirection(scrollDirection);
      if (Math.abs(document.body.scrollHeight - document.body.clientHeight - scrollY) < threshold) {
        setMustScrollFiltersDown(true);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection]);

  useEffect(() => {
    if (mustScrollFiltersDown) {
      filtersWrapperRef.current.scroll({ top: filtersWrapperRef.current.scrollHeight, behavior: 'smooth' });
      setMustScrollFiltersDown(false);
    }
  }, [mustScrollFiltersDown]);

  useEffect(() => {
    setInitialDataSet().then(() => getAllVoteablePresentations());
  }, [trackGroupId]);

  useEffect(() => {
    setAllBuildTimePostersByTrackGroup(filterByTrackGroup(allBuildTimePosters, parseInt(trackGroupId)));
  }, [allBuildTimePosters, trackGroupId]);

  useEffect(() => {
    let filteredPosters = filterByTrackGroup(posters, parseInt(trackGroupId));
    switch (appliedPageFilter) {
      case 'random':
        filteredPosters = randomSort(filteredPosters);
        break;
      case 'custom_order_asc':
        filteredPosters = filteredPosters.sort((a, b) => {
          if (a.custom_order < b.custom_order) return -1;
          if (a.custom_order > b.custom_order) return 1;
          return 0;
        });
        break;
      case 'custom_order_desc':
        filteredPosters = filteredPosters.sort((a, b) => { 
          if (a.custom_order < b.custom_order) return 1;
          if (a.custom_order > b.custom_order) return -1;
          return 0;
        });
        break;
      case 'my_votes':
        filteredPosters = filteredPosters.filter(poster => votes.some(v => v.presentation_id === poster.id));
        break;
      default:
        break;
    }
    setFilteredPosters(filteredPosters);
  }, [appliedPageFilter, posters, trackGroupId]);

  useEffect(() => {
    const pageTrackGroups = [...new Set(filteredPosters.map(p => p.track?.track_groups ?? []).flat())];
    setPageTrackGroups(pageTrackGroups);
  }, [filteredPosters]);

  useEffect(() => {
    if (!notifiedVotingPeriodsOnLoad &&
        pageTrackGroups.length &&
        pageTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
        pageTrackGroups.forEach(tg => {
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
        pageTrackGroups.length &&
        pageTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
        pageTrackGroups.forEach(tg => {
        if (votingPeriods[tg].phase === PHASES.DURING && votingPeriods[tg].remainingVotes === 0) {
          pushNotification(`You've reached your maximum votes. ${votingPeriods[tg].name} only allows for ${votingPeriods[tg].maxAttendeeVotes} votes per attendee`);
          setNotifiedMaximunAllowedVotesOnLoad(true);
        }
      });
    }
    if (votedPosterTrackGroups.length &&
        pageTrackGroups.length &&
        pageTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined)) {
        votedPosterTrackGroups.forEach(tg => {
        if (votingPeriods[tg].phase === PHASES.DURING && votingPeriods[tg].remainingVotes === 0) {
          pushNotification(`You've reached your maximum votes. ${votingPeriods[tg].name} only allows for ${votingPeriods[tg].maxAttendeeVotes} votes per attendee`);
          setVotedPosterTrackGroups([]);
        }
      });
    }
    if (pageTrackGroups.length &&
        pageTrackGroups.map(tg => votingPeriods[tg]).every(vp => vp !== undefined) &&
        pageTrackGroups.map(tg => previousVotingPeriods[tg]).every(vp => vp !== undefined)) {
        pageTrackGroups.forEach(tg => {
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
  }, [pageTrackGroups, votingPeriods]);

  const toggleVote = (presentation, isVoted) => {
    setVotedPosterTrackGroups(presentation.track?.track_groups);
    isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
  };

  const filterProps = {
    summit,
    events: allBuildTimePostersByTrackGroup,
    allEvents: allBuildTimePostersByTrackGroup,
    filters,
    triggerAction: (action, payload) => {
      updateFilter(payload);
    },
    marketingSettings: colorSettings,
    colorSource: '',
  };

  return (
    <Layout location={location}>
      <AttendanceTrackerComponent sourceName="POSTERS" />
      {pageSettings &&
      <PageHeader
        title={pageSettings.title}
        subtitle={pageSettings.subtitle}
        backgroundImage={pageSettings.image}
      />
      }
      <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ''}`}>
        <div className={styles.postersWrapper}>
          <PosterHeaderFilter changeHeaderFilter={(value) => setAppliedPageFilter(value)} />
          {filteredPosters &&
          <PosterGrid
            posters={filteredPosters}
            showDetailPage={(posterId) => navigate(`/a/poster/${posterId}`)}
            votingPeriods={votingPeriods}
            votingAllowed={!!attendee}
            votes={votes}
            toggleVote={toggleVote}
          />
          }
        </div>
        <div ref={filtersWrapperRef} className={styles.filterWrapper}>
          <ScheduleFilters {...filterProps} />
        </div>
        <FilterButton open={showFilters} onClick={() => setShowFilters(!showFilters)} />
        <NotificationHub children={(add) => { notificationRef.current = add }} />
      </div>
    </Layout>
  );
};

const mapStateToProps = ({ settingState, presentationsState, userState, summitState }) => ({
  pagesSettings: [...settingState.posterPagesSettings.posterPages],
  posters: presentationsState.voteablePresentations.filteredPresentations,
  allBuildTimePosters: presentationsState.voteablePresentations.ssrPresentations,
  allPosters: presentationsState.voteablePresentations.allPresentations,
  votingPeriods: presentationsState.votingPeriods,
  attendee: userState.attendee,
  votes: userState.attendee?.presentation_votes ?? [],
  summit: summitState.summit,
  filters: presentationsState.voteablePresentations.filters,
  colorSettings: settingState.colorSettings
});

export default connect(mapStateToProps, {
  setInitialDataSet,
  getAllVoteablePresentations,
  castPresentationVote,
  uncastPresentationVote,
  updateFilter
})(PostersPage);
