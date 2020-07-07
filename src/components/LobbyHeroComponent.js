import React from 'react'

import LobbyHero from '../content/hero-banner.json'
import styles from '../styles/lobby-hero.module.scss'

console.log(LobbyHero.image);

const LobbyHeroComponent = ({ }) => (  
  <section class="hero">
    <div className={`${styles.heroColumns} columns`}>
      <div className={`${styles.leftColumn} column is-6 is-black`}>
        <div class={`${styles.heroContainer} hero-body`}>
          <div class="container">
            <h1 class="title">
              {LobbyHero.title}
            </h1>
            <h2 class="subtitle">
              {LobbyHero.subTitle}
            </h2>
          </div>
        </div>
      </div>
      <div className={`${styles.midColumn} column is-1 is-info`}></div>
      <div className={`${styles.rightColumn} column is-6 is-danger`} style={{backgroundImage: `url(${LobbyHero.image})`}}></div>
    </div>
  </section>

)

export default LobbyHeroComponent