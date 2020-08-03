import React from 'react'

import LobbyHero from '../content/hero-banner.json'
import styles from '../styles/lobby-hero.module.scss'

const LobbyHeroComponent = () => (
  <section className="hero">
    <div className={`${styles.heroColumns} columns`}>
      <div className={`${styles.leftColumn} column is-6 is-black`}>
        <div className={`${styles.heroContainer} hero-body`}>
          <div className="container">
            <h1 className="title">
              {LobbyHero.hero_title ? LobbyHero.hero_title : LobbyHero.title}
            </h1>
            <h2 className="subtitle">
              {LobbyHero.hero_subtitle ? LobbyHero.hero_subtitle : LobbyHero.subTitle}
            </h2>
          </div>
        </div>
      </div>
      <div className={`${styles.midColumn} column is-1 is-info`}></div>
      <div className={`${styles.rightColumn} column is-6 is-danger`} style={{ backgroundImage: `url(${LobbyHero.hero_image ? LobbyHero.hero_image : LobbyHero.image})` }}></div>
    </div>
  </section>

)

export default LobbyHeroComponent