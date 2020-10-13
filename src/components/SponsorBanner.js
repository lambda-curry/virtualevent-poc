import React from 'react'

import Link from './Link'

import styles from '../styles/sponsor-page.module.scss'

const SponsorBanner = ({ bgColor }) => (
  <div className={`${styles.containerBanner}`} style={{ backgroundColor: bgColor }}>
    <div className={styles.containerText}>
      <span className={styles.adText}>
        <b>Contact us for more information.</b>
      </span>
    </div>
    <div className={styles.containerButtons}>
      <a className={styles.link}>
        <button className={`${styles.button} button is-large`}>
          <i className={`fa fa-2x fa-qrcode icon is-large`}></i>
          <b>Scan your badge</b>
        </button>
      </a>
      <a className={styles.link}>
        <button className={`${styles.button} button is-large`}>
          <i className={`fa fa-2x fa-envelope icon is-large`}></i>
          <b>Contact Us</b>
        </button>
      </a>
    </div>
  </div>
)

export default SponsorBanner