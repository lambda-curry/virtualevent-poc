import React from 'react'

import Link from '../components/Link'

import styles from '../styles/sponsor.module.scss'

import Content from '../content/sponsor.json'

const SponsorComponent = ({ tier }) => {

  const selectedTier = Content.sponsors.find(s => s.tier === tier);
  const sponsors = selectedTier.sponsors;
  const button = selectedTier.button;
  const template = selectedTier.template;

  if (sponsors.length > 0) {
    switch (template) {
      case 'big-images':
        return (
          <div className={styles.goldContainer}>
            <span><b>{tier} Sponsors</b></span>
            {sponsors.map((sponsor, index) => {
              return (
                <Link to={sponsor.link} key={index}>
                  <img src={sponsor.image} alt={sponsor.name} />
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
      case 'small-images':
        return (
          <div className={styles.silverContainer}>
            <span><b>{tier} Sponsors</b></span>
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