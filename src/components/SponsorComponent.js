import React from 'react'

import Link from '../components/Link'

import styles from '../styles/sponsor.module.scss'

import Data from '../content/sponsors.json'
import Tiers from '../content/sponsors-tiers.json'

const SponsorComponent = () => {

  return (

    Data.tierSponsors.map(s => {
      const sponsors = s.sponsors;
      const tier = Tiers.tiers.find(t => t.id === s.tier[0].value);
      const template = tier.lobby.lobbyTemplate;
      const button = tier.lobby.button;

      if (sponsors.length > 0) {
        switch (template) {
          case 'big-images':
            return (
              <div className={styles.goldContainer}>
                <span><b>{tier.name} Sponsors</b></span>
                {sponsors.map((sponsor, index) => {
                  return (
                    <Link to={`/a/sponsor/${sponsor.id}`} key={index}>
                      <img src={sponsor.logo} alt={sponsor.name} />
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
                <span><b>{tier.name} Sponsors</b></span>
                {sponsors.map((sponsor, index) => {
                  return (
                    <div className={styles.imageBox} key={index}>
                      <Link to={`/a/sponsor/${sponsor.id}`}>
                        <img src={sponsor.logo} alt={sponsor.name} />
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
          case 'horizontal-images':
            return (
              <div className={styles.horizontalContainer}>
                {sponsors.map((sponsor, index) => {
                  return (
                    <div className={styles.imageBox} key={index}>
                      <Link to={sponsor.link}>
                        <img src={sponsor.logo} alt={sponsor.name} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )
        }
      } else {
        return null;
      }
    })
  )
}

export default SponsorComponent;