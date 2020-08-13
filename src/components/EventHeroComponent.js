import React from 'react'

import Content from '../content/marketing-site.json'
import styles from '../styles/lobby-hero.module.scss'

const EventHeroComponent = () => (
  <section className="hero">
    <div className={`${styles.heroEvents} columns`}>
      <div className={'column is-12'}>
        <div className={`${styles.heroBody} hero-body`}>
          <div className={`${styles.heroEventContainer}`}>
            <div>
              <span className={styles.title}>
                {Content.heroBanner.title}
              </span>
              <span className={styles.subtitle}>
              {Content.heroBanner.subTitle}
              </span>
            </div>
            <div className={styles.date}>
              <span>{Content.heroBanner.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

)

export default EventHeroComponent