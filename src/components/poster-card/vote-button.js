import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({ isVoted, canVote, toggleVote, style }) => {
  const [togglingVote, setTogglingVote] = useState(false);
  const [iconClass, setIconClass] = useState(isVoted ? 'fa-heart' : 'fa-heart-o');
  const [buttonClass, setButtonClass] = useState(isVoted ? styles.added : styles.add);
  const [title, setTitle] = useState(isVoted ? 'Remove vote' : canVote ? 'Vote for this poster!' : 'Maximun votes registered');
  const [disabled, setDisabled] = useState(!(canVote || isVoted));

  const handleClick = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    if (toggleVote) {
      toggleVote();
      setTogglingVote(true);
    }
  };

  const configureButton = (isVoted, togglingVote) => {
    setIconClass(isVoted === togglingVote ? 'fa-heart-o' : 'fa-heart');
    if (isVoted) {
      setButtonClass(togglingVote ? styles.add : styles.added);
      setTitle(togglingVote ? 'Removing vote' : 'Remove vote');
    } else {
      setButtonClass(togglingVote ? styles.added : canVote ? styles.add : styles.disabled);
      setTitle(togglingVote ? 'Voting!' : canVote ? 'Vote for this poster!' : 'Maximun votes registered');
    }
  };

  useEffect(() => {
    if (togglingVote) {
      setTogglingVote(false);
    } else {
      configureButton(isVoted, togglingVote);
    }
  }, [isVoted]);

  useEffect(() => {
    configureButton(isVoted, togglingVote);
  }, [togglingVote]);

  return (
    <button
      title={title}
      className={`${styles.voteButton} ${buttonClass}`}
      onClick={handleClick}
      disabled={disabled || togglingVote}
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