import React from 'react'

import Link from '../components/Link'

import styles from '../styles/sponsor.module.scss'

import Content from '../content/sponsor.json'

const SponsorComponent = ({ tier }) => {

  const sponsors = Content.sponsors[tier].sponsors;
  const button = Content.sponsors[tier].button;

  if (sponsors.length > 0) {
    switch (tier) {
      case 'headline':
        return (
          <div className={styles.goldContainer}>
            <span><b>Gold Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <Link to={sponsor.link}>
                  <img src={sponsor.image} alt={sponsor.name} key={index} />
                </Link>
              )
            })}
            {button.text && button.link &&
              <Link className={styles.link} to={button.link}>
                <button className={`${styles.button} button is-large`}>
                  {button.text}
                </button>
              </Link>
            }
          </div>
        )
      case 'premier':
        return (
          <div className={styles.silverContainer}>
            <span><b>Silver Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <div className={styles.imageBox} key={index}>
                  <Link to={sponsor.link}>
                    <img src={sponsor.image} alt={sponsor.name} />
                  </Link>
                </div>
              )
            })}
            {button.text && button.link &&
              <Link className={styles.link} to={button.link}>
                <button className={`${styles.button} button is-large`}>
                  {button.text}
                </button>
              </Link>
            }
          </div>
        )
      case 'exhibitor':
        return (
          <div className={styles.silverContainer}>
            <span><b>Silver Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <div className={styles.imageBox} key={index}>
                  <Link to={sponsor.link}>
                    <img src={sponsor.image} alt={sponsor.name} />
                  </Link>
                </div>
              )
            })}
            {button.text && button.link &&
              <Link className={styles.link} to={button.link}>
                <button className={`${styles.button} button is-large`}>
                  {button.text}
                </button>
              </Link>
            }
          </div>
        )
    }
  } else {
    return null;
  }
}

export default SponsorComponent;