import React from "react"
import { navigate } from "gatsby";

import styles from '../styles/poster-components.module.scss'

const PosterLiveSession = ({ poster }) => {

    const goToLiveSession = (url) => {
        navigate(url);
    }

    return (
        <div className={styles.posterJoinContainer}>
            <span>
                Join the live session
            </span>
            <button onClick={() => goToLiveSession(poster.meeting_url)} className="poster-button button">
                <i className={`fa fa-sign-in icon is-large`} />
                <b>Participate</b>
            </button>
        </div>
    )
}

export default PosterLiveSession;