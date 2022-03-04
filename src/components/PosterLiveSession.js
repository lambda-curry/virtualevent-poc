import React from "react"
import { navigate } from "gatsby";

import styles from '../styles/poster-components.module.scss'

const PosterLiveSession = ({ poster }) => {

    const goToLiveSession = (url) => {
        const internal = /^\/(?!\/)/.test(url);
        if (!internal) {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
        } else navigate(url);
    }

    return (
        <div className={styles.posterJoinContainer}>
            <span>
                Join the sessions
            </span>
            <button onClick={() => goToLiveSession(poster.meeting_url)} className="poster-button button">
                <b>Check out the schedule</b>
            </button>
        </div>
    )
}

export default PosterLiveSession;