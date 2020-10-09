import React from 'react'

import HomeSettings from '../content/home-settings.json'
import styles from '../styles/lobby-hero.module.scss'

const LobbyHeroComponent = () => (
  <section className="hero">
    <div className={`${styles.heroColumns} columns`}>
      <div className={`${styles.leftColumn} column is-6 is-black`}>
        <div className={`${styles.heroContainer} hero-body`}>
          <div className="container">
            <h1 className="title">
              {HomeSettings.homeHero.title}
            </h1>
            <h2 className="subtitle">
              {HomeSettings.homeHero.subTitle}
            </h2>
          </div>
        </div>
      </div>
      <div className={`${styles.midColumn} column is-1 is-info`}></div>
      <div className={`${styles.rightColumn} column is-6 is-danger`} style={{ backgroundImage: `url(${HomeSettings.homeHero.image})` }}></div>
    </div>
  </section>

)

export default LobbyHeroComponent