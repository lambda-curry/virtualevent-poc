import React from 'react'

import Link from '../components/Link'

import styles from '../styles/advertise.module.scss'

const AdvertiseSponsorsComponent = ({ ads }) => {

  if (ads.length > 0) {
    return (
      ads.map((ad, index) => {
        return (
          <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
            {!ad.link &&
              <img src={ad.image} alt="sponsor" />
            }
            {!ad.text && ad.link &&
              <Link to={ad.link}>
                <img src={ad.image} alt="sponsor" />
              </Link>
            }
            {ad.text && ad.link &&
              <React.Fragment>
                <img src={ad.image} alt="sponsor" />
                <Link className={styles.link} to={ad.link}>
                  <button className={`${styles.button} button is-large`}>
                    <b>{ad.text}</b>
                  </button>
                </Link>
              </React.Fragment>
            }
          </div>
        )
      })
    )
  } else {
    return null;
  }
}

export default AdvertiseSponsorsComponent;