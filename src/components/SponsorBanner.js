import React from 'react'

import Link from './Link'

import styles from '../styles/sponsor-page.module.scss'

const SponsorBanner = ({ sponsor, bgColor, scanBadge }) => (
  <div className={`${styles.containerBanner}`} style={{ backgroundColor: bgColor }}>
    <div className={styles.containerText}>
      <span className={styles.adText}>
        <b>Contact us for more information.</b>
      </span>
    </div>
    <div className={styles.containerButtons}>
      <Link className={styles.link} onClick={scanBadge}>
        <button className={`${styles.button} button is-large`}>
          <i className={`fa fa-2x fa-qrcode icon is-large`}></i>
          <b>Scan your badge</b>
        </button>
      </Link>
      {sponsor.email &&
        <Link className={styles.link} to={sponsor.email}>
          <button className={`${styles.button} button is-large`}>
            <i className={`fa fa-2x fa-envelope icon is-large`}></i>
            <b>Contact Us</b>
          </button>
        </Link>
      }
    </div>
  </div>
)

export default SponsorBanner