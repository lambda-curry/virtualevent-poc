import React, {useState} from 'react';
import PropTypes from 'prop-types';

import BlockImage from 'react-block-image';
import VoteButton from './vote-button';

import styles from './index.module.scss';
import placeholder from '../../img/poster_fallback.png';
import { navigate } from 'gatsby';

const PosterCard = ({ poster, showDetail, canVote, isVoted, toggleVote }) => {
  const [hover, setHover] = useState(false);
  if (!poster) return null;
  const { title, custom_order, track, media_uploads } = poster;
  const posterImage = media_uploads.find(m => m.name === 'Poster');
  if (!posterImage) return null;
  const handleClick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      if (showDetail) {
        showDetail();
      }
  };
  const goToPresentation = (id) => {
    navigate(`/a/poster/${id}`);
  }
  return (
    <article className={styles.card} onClick={() => goToPresentation(poster.id)}>
      <BlockImage
        fallback={placeholder}
        src={posterImage.public_url}
        className={`${styles.header} ${showDetail && hover ? styles.header__hover : ''}`}
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
      >
        { showDetail && hover &&
        <button className={`${styles.button} button is-large`}>
          <i className={'fa fa-2x fa-eye icon is-large'} />
          <b>Detail</b>
        </button>
        }
      </BlockImage>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.order}>
          { custom_order ? `#${custom_order}` : <>&nbsp;</> }
        </span>
        { track?.name && track?.color &&
        <span className={styles.track} style={{backgroundColor: track.color}}>{track.name}</span>
        }
        <VoteButton
          isVoted={isVoted}
          canVote={canVote}
          toggleVote={() => toggleVote(poster, !isVoted)}
        />
      </div>
    </article>
  );
};

PosterCard.propTypes = {
  poster: PropTypes.object.isRequired,
  showDetail: PropTypes.func,
  canVote: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired
};

export default PosterCard;
