import React from 'react';

import PropTypes from 'prop-types';
import PosterCard from '../poster-card';

import styles from './index.module.scss';

const PosterGrid = ({posters, showDetail, canVote, toggleVote, votes}) => {
  if (!posters) return null;
  const cards = posters.map(poster => 
    <PosterCard
      key={`poster-${poster.id}`}
      poster={poster}
      showDetail={showDetail}
      canVote={canVote}
      isVoted={!!votes.find(v => v.presentation_id === poster.id)}
      toggleVote={toggleVote}
    />
  );
  return (
    <div className={styles.posters}>
      { cards }
    </div>
  )
};
PosterGrid.propTypes = {
  posters: PropTypes.array.isRequired,
  showDetail: PropTypes.func,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired,
  votes: PropTypes.array.isRequired
};
export default PosterGrid;