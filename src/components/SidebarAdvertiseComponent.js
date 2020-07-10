import React from 'react'

import styles from '../styles/sidebar-advertise.module.scss'

import Content from '../content/ads.json'

const SidebarAdvertise = ({ section, id }) => {

  const sectionAds = Content.ads.find(ad => ad.section === section).ads;
  
  if (sectionAds.length > 0) {
    return (
      sectionAds.map((ad, index) => {
        return (
          ad.id ?
            ad.id === id ?
              <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                <img src={ad.image} alt="sponsor" />
                <button className={`${styles.button} button is-large`}>
                  <b>{ad.text}</b>
                </button>
              </div>
              :
              null
            :
            <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
              <img src={ad.image} alt="sponsor" />
              <button className={`${styles.button} button is-large`}>
                <b>{ad.text}</b>
              </button>
            </div>
        )
      })
    )
  } else {
    return null;
  }
}

export default SidebarAdvertise;