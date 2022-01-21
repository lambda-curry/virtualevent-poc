import React from 'react'
import Ad from "./Ad";

import styles from '../styles/advertise.module.scss'

const AdvertiseSponsorsComponent = ({ ads }) => {

    if (ads.length === 0) return null;

    return (
        ads.map((ad, index) =>
            <Ad
                image={ad.image}
                alt={ad.alt}
                text={ad.text}
                link={ad.link}
                wrapperClass={`${styles.sponsorContainer} sponsor-container`}
                key={`ad-${index}`}
            />
        )
    )
}

export default AdvertiseSponsorsComponent;