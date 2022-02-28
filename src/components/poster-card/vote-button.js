import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({ isVoted, canVote, toggleVote, style }) => {
  const [vote, setVote] = useState(isVoted);
  const [iconClass, setIconClass] = useState(isVoted ? 'fa-heart' : 'fa-heart-o');
  const [buttonClass, setButtonClass] = useState(isVoted ? styles.added : styles.add);
  const [title, setTitle] = useState(isVoted ? 'Remove vote' : canVote ? 'Vote for this poster!' : 'Maximun votes registered');

  const handleClick = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    if (toggleVote) {
      toggleVote();
      setVote(!vote);
    }
  };

  const configureButton = () => {
    if (vote !== isVoted) {
      setTitle(vote ? 'Voting!' : 'Removing vote');
      setIconClass(vote ? 'fa-heart' : 'fa-heart-o');
      setButtonClass(vote ? styles.added : styles.add);
    } else {
      setTitle(vote ? 'Remove vote' : canVote ? 'Vote for this poster!' : 'Maximun votes registered');
      setIconClass(vote ? 'fa-heart' : 'fa-heart-o');
      setButtonClass(vote ? styles.added : canVote ? styles.add : styles.disabled);
    }
  };

  useEffect(() => {
    configureButton();
  }, [vote, canVote]);

  useEffect(() => {
    if (isVoted !== vote) {
      setVote(isVoted);
    } else {
      configureButton();
    }
  }, [isVoted]);

  return (
    <button
      title={title}
      className={`${styles.voteButton} ${buttonClass}`}
      onClick={handleClick}
      disabled={!(canVote || isVoted) || (vote !== isVoted)}
      style={style}
    >
      <i className={`fa ${iconClass}`} aria-hidden="true" />
    </button>
  );
}

VoteButton.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired
};

export default VoteButton;