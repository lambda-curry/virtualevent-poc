import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import PosterCard from '../poster-card';

import { PHASES } from '../../utils/phasesUtils';

import styles from './index.module.scss';

const PosterGrid = ({ posters, showDetailPage = null, votingAllowed, votingPeriods, votes, toggleVote }) => {

  const isDuringVotingPhase = useCallback((poster) => {
    const results = poster.track?.track_groups?.map(trackGroupId =>
      votingPeriods[trackGroupId]?.phase === PHASES.DURING
    );
    return results && results.length ? results.every(r => !!r) : false;
  }, [votingPeriods]);

  const canVote = useCallback((poster) => {
    const results = poster.track?.track_groups?.map(trackGroupId =>
      votingPeriods[trackGroupId]?.remainingVotes > 0
    );
    return results && results.length ? results.every(r => !!r) : false;
  }, [votingPeriods]);

  if (!posters) return null;

  const cards = posters.map(poster => 
    <PosterCard
      key={`poster-${poster.id}`}
      poster={poster}
      showDetailPage={showDetailPage ? () => showDetailPage(poster.id) : null}
      showVoteButton={votingAllowed && isDuringVotingPhase(poster)}
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