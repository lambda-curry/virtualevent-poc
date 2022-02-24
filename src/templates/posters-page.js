import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { navigate } from "gatsby";
import Layout from '../components/Layout';
import PageHeader from '../components/page-header';
import PosterGrid from '../components/poster-grid';
import ScheduleFilters from '../components/ScheduleFilters';
import PosterHeaderFilter from '../components/poster-header-filter';
import FilterButton from '../components/FilterButton';
import AttendanceTrackerComponent from "../components/AttendanceTrackerComponent";

import {
  setInitialDataSet,
  getAllVoteablePresentations,
  updateFilter
} from '../actions/presentation-actions';

import {
  castPresentationVote,
  uncastPresentationVote
} from '../actions/user-actions';

import { filterByTrackGroup } from '../utils/filterUtils';

import styles from '../styles/posters-page.module.scss';

const PostersPage = ({
  location,
  trackGroupId,

  pagesSettings,
  setInitialDataSet,
  getAllVoteablePresentations,
  posters,
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

  const [showFilters, setShowfilters] = useState(false);
  const [postersByTrackGroup, setPostersByTrackGroup] = useState(posters);
  const [allBuildTimePostersByTrackGroup, setAllBuildTimePostersByTrackGroup] = useState(allBuildTimePosters);
  const [pageSettings] = useState(pagesSettings.find(pps => pps.trackGroupId === parseInt(trackGroupId)));

  useEffect(() => {
    setInitialDataSet().then(() => getAllVoteablePresentations());
  }, [trackGroupId]);

  useEffect(() => {
    setPostersByTrackGroup(filterByTrackGroup(posters, parseInt(trackGroupId)));
  }, [posters, trackGroupId]);

  useEffect(() => {
    setAllBuildTimePostersByTrackGroup(filterByTrackGroup(allBuildTimePosters, parseInt(trackGroupId)));
  }, [allBuildTimePosters, trackGroupId]);

  const toggleVote = (presentation, isVoted) => {
    isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
  };

  const headerFilter = (value) => {
    switch (value) {
      case 'page_random': {
        let randomPosters = [...postersByTrackGroup];
        for (let i = randomPosters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomPosters[i], randomPosters[j]] = [randomPosters[j], randomPosters[i]];
        }
        setPostersByTrackGroup(randomPosters);
        break;
      }
      case 'custom_order': {
        let sortedPosters = [...postersByTrackGroup];
        sortedPosters = sortedPosters.sort((a, b) => a.custom_order - b.custom_order);
        setPostersByTrackGroup(sortedPosters);
        break;
      }
      case 'my_votes': {
        let votedPosters = [...postersByTrackGroup];
        votedPosters = votedPosters.filter(poster => votes.some(e => e.presentation_id === poster.id));
        setPostersByTrackGroup(votedPosters);
        break;
      }
      default:
        setPostersByTrackGroup(filterByTrackGroup(posters, parseInt(trackGroupId)));
        break;
    }
  }

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
      {postersByTrackGroup &&
        <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ''}`}>
          <div className={styles.postersWrapper}>
            <PosterHeaderFilter changeHeaderFilter={(value) => headerFilter(value)} />
            <PosterGrid
              posters={postersByTrackGroup}
              showDetailPage={(posterId) => navigate(`/a/poster/${posterId}`)}
              votingPeriods={votingPeriods}
              votingAllowed={!!attendee}
              votes={votes}
              toggleVote={toggleVote}
            />
          </div>
          <div className={styles.filterWrapper}>
            <ScheduleFilters {...filterProps} />
          </div>
          <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)} />
        </div>
      }
    </Layout>
  );
};


const mapStateToProps = ({ settingState, presentationsState, userState, summitState }) => ({
  pagesSettings: [...settingState.posterPagesSettings.posterPages],
  posters: presentationsState.voteablePresentations.filteredPresentations,
  allBuildTimePosters: presentationsState.voteablePresentations.ssrPresentations,
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
