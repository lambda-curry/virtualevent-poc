import React from 'react'
import { navigate } from 'gatsby';

import styles from '../styles/poster-components.module.scss'

const PosterNavigation = ({ allPosters, poster }) => {

  const viewAll = () => {
    navigate('/a/posters')
  }

  const nextPoster = () => {
    const next = allPosters.find(e => e.id > poster.id);
    next ? navigate(`/a/poster/${next.id}`) : navigate(`/a/poster/${allPosters[0].id}`);
  }


  const prevPoster = () => {
    // slice to avoid mutate the array, then reverse and find
    const prev = allPosters.slice().reverse().find(e => e.id < poster.id);
    prev ? navigate(`/a/poster/${prev.id}`) : navigate(`/a/poster/${allPosters[allPosters.length - 1].id}`);
  }

  return (
      <div className={`columns mx-0 my-0 py-5 ${styles.navigationContainer}`}>
        <button className={styles.navigationButton} onClick={() => prevPoster()}>
          <i className={`fa fa-2x fa-chevron-left icon is-large`} />
          Previous Poster
        </button>
        <button className={styles.navigationButton} onClick={() => viewAll()}>
          <i className={`fa fa-2x fa-th-large icon is-large`} />
          View All
        </button>
        <button className={styles.navigationButton} onClick={() => nextPoster()}>
          Next Poster
          <i className={`fa fa-2x fa-chevron-right icon is-large`} />
        </button>
      </div>
  )
};

export default PosterNavigation;