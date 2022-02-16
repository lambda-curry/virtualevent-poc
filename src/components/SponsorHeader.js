import React, { useState, useEffect, useRef } from 'react'

import Link from './Link'

import styles from '../styles/sponsor-page.module.scss'

const SponsorHeader = ({ sponsor, tier, scanBadge }) => {

  const [isMuted, _setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(null);
  const videoParentRef = useRef(null);

  const setIsMuted = (isMuted) => {
    const player = videoParentRef.current.children[0];
    player.muted = isMuted;
    _setIsMuted(isMuted)
  };

  const onResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return (
    <section className={styles.hero}>
      <div className={`${isMobile ? styles.heroSponsorMobile : styles.heroSponsor}`}>
        {!sponsor.headerVideo &&
          <div className={styles.heroSponsorImageBg} style={{
              backgroundImage: `url(${isMobile ? sponsor.headerImageMobile.file : sponsor.headerImage.file})`,
              paddingBottom: `${isMobile ? '82.77%' : tier.sponsorPage.sponsorTemplate === 'big-header' ? '27.77%' : '18.88%'}`,
              maxHeight: `${tier.sponsorPage.sponsorTemplate === 'big-header' ? '400px' : '200px'}`
            }}
          />
        }
        {sponsor.headerVideo &&
          <div ref={videoParentRef}
            style={{
              paddingBottom: `${tier.sponsorPage.sponsorTemplate === 'big-header' ? '27.77%' : '18.88%'}`,
              maxHeight: `${tier.sponsorPage.sponsorTemplate === 'big-header' ? '400px' : '200px'}`
            }}
            dangerouslySetInnerHTML={{
              __html: `
              <video class=${styles.heroVideo} preload="auto" autoPlay loop muted playsinline>
                <source src=${sponsor.headerVideo} type="video/mp4" />
              </video>
              `
            }} />
        }
        <div className={`${styles.heroBody}`}>
          <div className={`${styles.heroSponsorContainer}`}>
            <div className={styles.leftContainer}>
              {sponsor.socialNetworks && sponsor.socialNetworks.map((net, index) => (
                net.display && net.icon &&
                <Link to={net.link} className={styles.link} key={index}>
                  <i className={`fa icon is-large ${net.icon}`} />
                </Link>
              ))}
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.category}>
                {sponsor.headerVideo &&
                  <button className="link" onClick={() => setIsMuted(!isMuted)}>
                    <i className={`${styles.volumeButton} fa fa-2x ${isMuted ? 'fa-volume-off' : 'fa-volume-up'} icon is-large`} />
                  </button>
                }
                {tier.badge && <img alt="badge" src={tier.badge} />}
              </div>
              <div className={`${tier.sponsorPage.sponsorTemplate === 'big-header' ? styles.buttons : styles.buttonsSmall}`}>
                <Link className={styles.link} onClick={scanBadge}>
                  <button className={`${styles.button} button is-large`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
                    <i className={`fa fa-2x fa-qrcode icon is-large`} />
                    <b>Scan your badge</b>
                  </button>
                </Link>
                {sponsor.email &&
                  <Link className={styles.link} to={sponsor.email}>
                    <button className={`${styles.button} button is-large`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
                      <i className={`fa fa-2x fa-envelope icon is-large`} />
                      <b>Contact Us!</b>
                    </button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {sponsor.marquee &&
        <div className={`${tier.sponsorPage.sponsorTemplate === 'big-header' ? styles.bottomBar : styles.bottomBarSmall}`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
          <div className={styles.track}>
            <div>
              {`${sponsor.marquee} `.repeat(100).slice(0, 459)}
            </div>
          </div>
        </div>
      }
    </section >
  )
}

export default SponsorHeader