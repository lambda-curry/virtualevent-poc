import React from 'react'

import styles from '../styles/sponsor.module.scss'

import Content from '../content/sponsor.json'

const SponsorComponent = ({ tier }) => {

  const sponsors = Content.sponsors[tier].sponsors;
  const button = Content.sponsors[tier].button;

  if (sponsors.length > 0) {
    switch (tier) {
      case 'gold':
        return (
          <div className={styles.goldContainer}>
            <span><b>Gold Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <img src={sponsor.image} alt={sponsor.name} key={index} />
              )
            })}
            {button.text && button.link &&
              <a className={styles.link} href={button.link}>
                <button className={`${styles.button} button is-large`}>
                  {button.text}
                </button>
              </a>
            }
          </div>
        )
      case 'silver':
        return (
          <div className={styles.silverContainer}>
            <span><b>Silver Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <div className={styles.imageBox} key={index}>
                  <img src={sponsor.image} alt={sponsor.name} />
                </div>
              )
            })}
            {button.text && button.link &&
              <a className={styles.link} href={button.link}>
                <button className={`${styles.button} button is-large`}>
                  {button.text}
                </button>
              </a>
            }
          </div>
        )
    }
  } else {
    return null;
  }
}

export default SponsorComponent;