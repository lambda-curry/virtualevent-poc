import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import PosterGrid from '../components/poster-grid';
import ScheduleFilters from '../components/ScheduleFilters';
import FilterButton from '../components/FilterButton';

import {
  setInitialDataSet,
  getVoteablePresentations,
  updateFilter
} from '../actions/presentation-actions';

import {
  castPresentationVote,
  uncastPresentationVote

} from '../actions/user-actions';

import styles from '../styles/posters-page.module.scss';

const PostersPage = ({
                      location,
                      trackGroupName,
                      setInitialDataSet,
                      getVoteablePresentations,
                      posters,
                      votes,
                      castPresentationVote,
                      uncastPresentationVote,
                      summit,
                      allPosters,
                      filters,
                      updateFilter,
                      colorSettings
                    }) => {

  const [canVote, setCanVote] = useState(true);
  const [showFilters, setShowfilters] = useState(false);

  useEffect(() => {
    setInitialDataSet()
  }, []);

  const toggleVote = (presentation, isVoted) => {
    isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
  };

  const filterProps = {
    summit,
    events: allPosters,
    allEvents: allPosters,
    filters,
    triggerAction: (action, payload) => {
      updateFilter(payload);
    },
    marketingSettings: colorSettings,
    colorSource: '',
  };

  return (
    <Layout location={location}>
      <div className="container">
        {posters &&
        <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ""}`}>
          <div className={styles.postersWrapper}>
            <PosterGrid posters={posters} canVote={canVote} votes={votes} toggleVote={toggleVote}/>
          </div>
          <div className={styles.filterWrapper}>
            <ScheduleFilters {...filterProps} />
          </div>
          <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)}/>
        </div>
        }
      </div>
    </Layout>
  );
};

PostersPage.propTypes = {};

const mapStateToProps = ({presentationsState, userState, summitState, settingState}) => ({
  posters: presentationsState.voteablePresentations.filteredPresentations,
  allPosters: presentationsState.voteablePresentations.ssrPresentations,
  filters: presentationsState.voteablePresentations.filters,
  votes: userState.attendee.presentation_votes,
  summit: summitState.summit,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
  setInitialDataSet,
  getVoteablePresentations,
  castPresentationVote,
  uncastPresentationVote,
  updateFilter,
})(PostersPage);
