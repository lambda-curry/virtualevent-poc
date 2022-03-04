import React from 'react'
import {navigate} from 'gatsby';

import styles from '../styles/poster-components.module.scss'
import {filterByTrackGroup} from '../utils/filterUtils';

const PosterNavigation = ({allPosters, poster}) => {

    let currentTrackId = poster.track.track_groups[0];
    const list = filterByTrackGroup(allPosters, currentTrackId);

    const viewAll = () => {
        navigate(`/a/posters/${currentTrackId}`);
    }

    const nextPoster = () => {
        const currentIndex = list.findIndex(e => e.id === poster.id);
        let nextIndex = (currentIndex < (list.length - 1)) ? currentIndex + 1 : 0;
        navigate(`/a/poster/${list[nextIndex].id}`);
    }

    const prevPoster = () => {
        const currentIndex = list.findIndex(e => e.id === poster.id);
        let prevIndex = (currentIndex > 0) ? currentIndex - 1 : (list.length - 1);
        navigate(`/a/poster/${list[prevIndex].id}`);
    }

    return (
        <div className={`columns mx-0 my-0 py-5 ${styles.navigationContainer}`}>
            {list.length > 0 &&
            <button className={styles.navigationButton} onClick={() => prevPoster()}>
                <i className={`fa fa-chevron-left icon is-medium`}/>
                Previous Poster
            </button>
            }
            <button className={styles.navigationButton} onClick={() => viewAll()}>
                <i className={`fa fa-th-large icon is-medium`}/>
                View All
            </button>
            {list.length > 0 &&
            <button className={styles.navigationButton} onClick={() => nextPoster()}>
                Next Poster
                <i className={`fa fa-chevron-right icon is-medium`}/>
            </button>
            }
        </div>
    )
};

export default PosterNavigation;