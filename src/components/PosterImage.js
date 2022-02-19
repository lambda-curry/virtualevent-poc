import React from "react"

import styles from '../styles/poster-components.module.scss';

const PosterImage = ({ mediaUpload , shouldShow = true}) => {
    return(
            <img
                className={styles.posterImage}
                alt={mediaUpload?.name}
                style={{ display: shouldShow ? 'inherit' : 'none' }}
                src={mediaUpload?.public_url}
            />
    );
};

export default PosterImage;