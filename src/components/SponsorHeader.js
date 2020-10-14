import React, { useState } from 'react'

import Link from './Link'

import styles from '../styles/sponsor-page.module.scss'

const SponsorHeader = ({ sponsor, tier }) => {

  const [isMuted, setIsMuted] = useState(false);

  return (
    <section className={styles.hero}>
      <div className={`${styles.heroSponsor}`}
        style={{
          backgroundImage: `url(${sponsor.headerImage})`,
          paddingBottom: `${tier.sponsorPage.sponsorTemplate === 'big-header' ? '27.77%' : '13.88%'}`,
          maxHeight: `${tier.sponsorPage.sponsorTemplate === 'big-header' ? '400px' : '200px'}`
        }}>
        {sponsor.headerVideo &&
          <video className={`${styles.heroVideo}`} id="sponsorVideo" preload="auto" autoPlay loop volume={isMuted ? '0' : '1'}>
            <source src={sponsor.headerVideo} type="video/mp4" />
          </video>
        }
        <div className={`${styles.heroBody}`}>
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
                <i onClick={() => setIsMuted(!isMuted)} className={`${styles.volumeButton} fa fa-2x ${isMuted ? 'fa-volume-off' : 'fa-volume-up'} icon is-large`}></i>
                <img src={tier.badge} />
              </div>
              <div className={`${tier.sponsorPage.sponsorTemplate === 'big-header' ? styles.buttons : styles.buttonsSmall}`}>
                <Link className={styles.link}>
                  <button className={`${styles.button} button is-large`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
                    <i className={`fa fa-2x fa-qrcode icon is-large`}></i>
                    <b>Scan your badge</b>
                  </button>
                </Link>
                {sponsor.email &&
                  <Link className={styles.link} to={`mailto:${sponsor.email}`}>
                    <button className={`${styles.button} button is-large`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
                      <i className={`fa fa-2x fa-envelope icon is-large`}></i>
                      <b>Contact Us!</b>
                    </button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
        <div className={styles.track}>
          <div>
            {`${sponsor.marquee} / `.repeat(100).slice(0, 259)}
          </div>
        </div>
      </div>
    </section >
  )
}

export default SponsorHeader