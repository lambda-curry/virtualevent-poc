import React from 'react';
import PropTypes from 'prop-types';

import PosterCard from '../poster-card';

import styles from './index.module.scss';

const Posters = ({posters, showDetail, canVote, toggleVote}) => {
  const cards = posters.map(poster => 
    <PosterCard
      key={`poster-${poster.order}`}
      poster={poster}
      showDetail={showDetail}
      canVote={canVote}
      toggleVote={toggleVote}
    />
  );
  return (
    <div className={styles.posters}>
      { cards }
    </div>
  )
};
Posters.propTypes = {
  posters: PropTypes.array.isRequired,
  showDetail: PropTypes.func,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired,
};

export default Posters;