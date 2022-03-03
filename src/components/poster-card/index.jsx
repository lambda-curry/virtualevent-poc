import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Controlled as ControlledZoom} from 'react-medium-image-zoom'

import BlockImage from 'react-block-image';
import VoteButton from './vote-button';
import PosterImage from '../PosterImage';

import styles from './index.module.scss';
import placeholder from '../../img/poster_fallback.png';

import 'react-medium-image-zoom/dist/styles.css'

const PosterCard = ({ poster, posterClick, showVoteButton, canVote, isVoted, toggleVote, showDetailPage }) => {
  const [hover, setHover] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false)
  const handleZoomChange = useCallback(shouldZoom => {
      setIsZoomed(shouldZoom)
  }, []);
  if (!poster) return null;
  const { title, custom_order, track, media_uploads } = poster;
  const posterImage = media_uploads.find(m => m.name === 'Poster');
  if (!posterImage) return null;
  const handleClick = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    posterClick();
  };
  const handleTitleClick = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    if (showDetailPage) {
      showDetailPage();
    }
  };
  return (
    <article className={styles.card}>
      <BlockImage
        fallback={placeholder}
        src={posterImage.public_url}
        className={styles.header}
      >
        <div className={`${styles.overlay} ${hover ? styles.overlay__hover : ''}`}
          onMouseEnter={() => setHover(true)} 
          onMouseOut={() => setHover(false)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          { hover &&
          <button className={`${styles.button} button is-large`}>
            <i className={'fa fa-2x fa-eye icon is-large'} />
            <b>Detail</b>
          </button>
          }
          <ControlledZoom
            isZoomed={isZoomed}
            onZoomChange={handleZoomChange}
            zoomMargin={50}
            overlayBgColorStart="rgba(0, 0, 0, 0)"
            overlayBgColorEnd="rgba(0, 0, 0, 0.8)"
          >
            <PosterImage mediaUpload={posterImage} shouldShow={isZoomed}/>
          </ControlledZoom>
        </div>
      </BlockImage>
      <h2 className={styles.title} onClick={handleTitleClick}>{title}</h2>
      <span className={styles.order}>
        { custom_order ? `#${custom_order}` : <>&nbsp;</> }
      </span>
      <div className={styles.footer}>
        { track?.name && track?.color &&
        <div className={styles.track}>
          <span style={{backgroundColor: track.color}}>{track.name}</span>
        </div>
        }
        { showVoteButton &&
        <VoteButton
          isVoted={isVoted}
          canVote={canVote}
          toggleVote={() => toggleVote(poster, !isVoted)}
        />
        }
      </div>
    </article>
  );
};

PosterCard.propTypes = {
  poster: PropTypes.object.isRequired,
  showVoteButton: PropTypes.bool.isRequired,
  canVote: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired
};

export default PosterCard;
