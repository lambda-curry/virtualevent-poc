import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import PosterCard from '../poster-card';

import {
  calculateRemaingVotes,
  calculateVotesPerTrackGroup,
  TRACK_GROUP_CLASS_NAME
} from '../../utils/voting-utils';

import { PHASES } from '../../utils/phasesUtils';

import styles from './index.module.scss';

const PosterGrid = ({ posters, showDetailPage = null, votingAllowed, votingPeriods, votes, toggleVote }) => {
  const [votesPerTrackGroup, setVotesPerTrackGroup] = useState({});
  const [remainingVotes, setRemainingVotes] = useState({});

  useEffect(() => {
    setVotesPerTrackGroup(calculateVotesPerTrackGroup(posters, votes));
  }, [posters, votes]);

  useEffect(() => {
    if (TRACK_GROUP_CLASS_NAME in votingPeriods)
      setRemainingVotes(calculateRemaingVotes(votingPeriods[TRACK_GROUP_CLASS_NAME], votesPerTrackGroup));
  }, [votingPeriods, votesPerTrackGroup]);

  const canVote = useCallback((poster) => {
    let result = false;
    if (!(TRACK_GROUP_CLASS_NAME in votingPeriods)) return result;
    if (poster && poster.track && poster.track.track_groups) {
      poster.track.track_groups.forEach(trackGroupId => {
        if (trackGroupId in votingPeriods[TRACK_GROUP_CLASS_NAME]) {
          const votingPeriod = votingPeriods[TRACK_GROUP_CLASS_NAME][trackGroupId];
          result = votingPeriod.phase === PHASES.DURING && remainingVotes[trackGroupId] > 0;
        }
      });
    }
    return result;
  }, [remainingVotes]);

  if (!posters) return null;

  const cards = posters.map(poster => 
    <PosterCard
      key={`poster-${poster.id}`}
      poster={poster}
      showDetailPage={showDetailPage ? () => showDetailPage(poster.id) : null}
      showVoteButton={votingAllowed}
      canVote={canVote(poster)}
      isVoted={!!votes.find(v => v.presentation_id === poster.id)}
      toggleVote={toggleVote}
    />
  );
  return (
    <div className={styles.posters} style={{gridTemplateColumns: posters.length === 3 ? '1fr 1fr 1fr' : ''}}>
      { cards }
    </div>
  )
};

PosterGrid.propTypes = {
  posters: PropTypes.array.isRequired,
  showDetailPage: PropTypes.func,
  votingAllowed: PropTypes.bool.isRequired,
  votingPeriods: PropTypes.object.isRequired,
  votes: PropTypes.array.isRequired,
  toggleVote: PropTypes.func.isRequired
};

export default PosterGrid;