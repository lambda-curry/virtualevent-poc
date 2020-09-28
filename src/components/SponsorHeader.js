import React from 'react'

import Link from './Link'
import Content from '../content/marketing-site.json'
import footerContent from '../content/footer.json';

import styles from '../styles/sponsor-page.module.scss'

const SponsorHeader = ({ sponsor, tier }) => (
  <section className={styles.hero}>
    <div className={`${styles.heroSponsor}`} style={{backgroundImage: `url(${sponsor.headerImage})`}}>
      <div className={`${styles.heroBody}`} style={{height: `${tier.sponsorTemplate !== 'big-header' ? '250px' : ''}`}}>
        <div className={`${styles.heroSponsorContainer}`}>
          {footerContent.social.display &&
            <div className={styles.leftContainer}>
              {footerContent.social.networks.map((net, index) => (
                net.display &&
                <Link to={net.link} className={styles.link} key={index}>
                  <i className={`fa icon is-large ${net.icon}`}></i>
                </Link>
              ))}
            </div>
          }
          <div className={styles.rightContainer}>
            <div className={styles.category}>
              <img src={tier.badge} />
            </div>
            <div className={styles.buttons}>
              <a className={styles.link}>
                <button className={`${styles.button} button is-large`}>
                  <i className={`fa fa-2x fa-qrcode icon is-large`}></i>
                  <b>Call to Action</b>
                </button>
              </a>
              <a className={styles.link}>
                <button className={`${styles.button} button is-large`}>
                  <i className={`fa fa-2x fa-calendar icon is-large`}></i>
                  <b>Schedule Call</b>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.bottomBar}>
      <div className={styles.track}>
        <div>
          {`${sponsor.marquee} / `.repeat(10)}
        </div>
      </div>
    </div>
  </section>

)

export default SponsorHeader