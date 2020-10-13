import React from 'react'

import Link from './Link'

import styles from '../styles/sponsor-page.module.scss'

const SponsorHeader = ({ sponsor, tier }) => (
  <section className={styles.hero}>
    <div className={`${styles.heroSponsor}`} style={{ backgroundImage: `url(${sponsor.headerImage})` }}>
      <video className={`${styles.heroVideo}`} preload="auto" autoPlay loop muted="muted" volume="0">
        <source src={sponsor.headerVideo} type="video/mp4" />
      </video>
      <div className={`${styles.heroBody}`} style={{ height: `${tier.sponsorPage.sponsorTemplate !== 'big-header' ? '250px' : ''}` }}>
        <div className={`${styles.heroSponsorContainer}`}>
          <div className={styles.leftContainer}>
            {sponsor.socialNetworks && sponsor.socialNetworks.map((net, index) => (
              net.display && net.icon &&
              <Link to={net.link} className={styles.link} key={index}>
                <i className={`fa icon is-large ${net.icon}`}></i>
              </Link>
            ))}
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.category}>
              <img src={tier.badge} />
            </div>
            <div className={styles.buttons}>
              <Link className={styles.link}>
                <button className={`${styles.button} button is-large`}>
                  <i className={`fa fa-2x fa-qrcode icon is-large`}></i>
                  <b>Scan your badge</b>
                </button>
              </Link>
              <Link className={styles.link} to={`mailto:${sponsor.email}`}>
                <button className={`${styles.button} button is-large`}>
                  <i className={`fa fa-2x fa-envelope icon is-large`}></i>
                  <b>Contact Us!</b>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.bottomBar}>
      <div className={styles.track}>
        <div>
          {`${sponsor.marquee} / `.repeat(100).slice(0,259)}
        </div>
      </div>
    </div>
  </section>

)

export default SponsorHeader