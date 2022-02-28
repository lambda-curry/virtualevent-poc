import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { navigate } from "gatsby";
import Layout from '../components/Layout';
import PageHeader from '../components/page-header';
import PosterGrid from '../components/poster-grid';
import ScheduleFilters from '../components/ScheduleFilters';
import PosterHeaderFilter from '../components/poster-header-filter';
import FilterButton from '../components/FilterButton';
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent';

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

  const [pageSettings] = useState(pagesSettings.find(ps => ps.trackGroupId === parseInt(trackGroupId)));
  const [pageTrackGroups, setPageTrackGroups] = useState([]);
  const [appliedPageFilter, setAppliedPageFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosters, setFilteredPosters] = useState(posters);
  const [allBuildTimePostersByTrackGroup, setAllBuildTimePostersByTrackGroup] = useState(allBuildTimePosters);

  useEffect(() => {
    setInitialDataSet().then(() => getAllVoteablePresentations());
  }, [trackGroupId]);

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
    setAllBuildTimePostersByTrackGroup(filterByTrackGroup(allBuildTimePosters, parseInt(trackGroupId)));
  }, [allBuildTimePosters, trackGroupId]);

  const toggleVote = (presentation, isVoted) => {
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
        <div className={styles.filterWrapper}>
          <ScheduleFilters {...filterProps} />
        </div>
        <FilterButton open={showFilters} onClick={() => setShowFilters(!showFilters)} />
      </div>
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
