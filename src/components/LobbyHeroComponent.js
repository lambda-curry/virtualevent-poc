import React from 'react'

import HeroContent from '../content/marketing-site.json'
import styles from '../styles/lobby-hero.module.scss'

const LobbyHeroComponent = () => (
  <section className={`${styles.ocpHeroLobby} pb-3`}>
    <div className={`${styles.ocpHeroColumns} columns`} style={{ backgroundImage: `url(${HeroContent.heroBanner.background})` }}>
      <div className={`${styles.ocpLeftColumn} column is-6 px-0 py-0`}>
        <div className={`${styles.ocpHeroContainer} hero-body`}>
          <div className="container">
            <h1 className={`${styles.title}`}>
              {HeroContent.heroBanner.title}
            </h1>
            <span className={`${styles.date}`}>
              {HeroContent.heroBanner.date}
            </span>
            <div className={styles.connect}>
              <h2 className={`${styles.subtitle}`}>
                CONNECT. <br />
                  COLLABORATE. <br />
                  ACCELERATE.
                </h2>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.ocpRightColumn} column is-6 px-0 py-0`}>
        <img src={HeroContent.heroBanner.images[0].image} />
      </div>
    </div>
  </section>
)

export default LobbyHeroComponent