import React from 'react'
import Slider from "react-slick";

import Link from '../components/Link'

import styles from '../styles/sponsor.module.scss'

import Data from '../content/sponsors.json'
import Tiers from '../content/sponsors-tiers.json'

import { getSponsorURL } from '../utils/urlFormating'

const SponsorComponent = ({ page }) => {
  const button = Tiers.lobbyButton;
  let renderButton = false;
  return (
    <React.Fragment>
      {Data.tierSponsors.map((s, tierIndex) => {
        const sponsors = s.sponsors;
        const tier = Tiers.tiers.find(t => t.id === s.tier[0].value);
        const template = page === 'lobby' ? tier.lobby.lobbyTemplate : page === 'event' ? tier.eventTemplate : 'expo-hall';

        if (sponsors?.length > 0) {
          renderButton = true;
          switch (template) {
            case 'big-images': {
              if (page === 'lobby' && !tier.lobby.display) {
                return null
              } else {
                return (
                  <div className={`${tierIndex === 0 ? styles.firstContainer : ''} ${styles.bigImageContainer}`} key={tierIndex}>
                    <span><b>{tier.widgetTitle}</b></span>
                    {sponsors.map((sponsor, index) => {
                      return (
                        sponsor.externalLink ?
                          <Link to={sponsor.externalLink} key={`${s.tier.label}-${index}`}>
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </Link>
                          :
                          sponsor.usesSponsorPage ?
                            <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`} key={`${s.tier.label}-${index}`}>
                              <img src={sponsor.logo} alt={sponsor.name} />
                            </Link>
                            :
                            <img src={sponsor.logo} alt={sponsor.name} />
                      )
                    })}
                  </div>
                )
              }
            }
            case 'small-images': {
              if (page === 'lobby' && !tier.lobby.display) {
                return null
              } else {
                return (
                  <div className={`${tierIndex === 0 ? styles.firstContainer : ''} ${styles.smallImageContainer}`} key={tierIndex}>
                    <span><b>{tier.widgetTitle}</b></span>
                    {sponsors.map((sponsor, index) => {
                      return (
                        sponsor.externalLink ?
                          <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                            <Link to={sponsor.externalLink}>
                              <img src={sponsor.logo} alt={sponsor.name} />
                            </Link>
                          </div>
                          : sponsor.usesSponsorPage ?
                            <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                              <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`}>
                                <img src={sponsor.logo} alt={sponsor.name} />
                              </Link>
                            </div>
                            :
                            <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                              <img src={sponsor.logo} alt={sponsor.name} />
                            </div>
                      )
                    })}
                  </div>
                )
              }
            }
            case 'horizontal-images': {
              return (
                <div className={`${tierIndex === 0 ? styles.firstContainer : ''} ${styles.horizontalContainer} px-6`} key={tierIndex}>
                  {sponsors.map((sponsor, index) => {
                    return (
                      sponsor.externalLink ?
                        <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                          <Link to={sponsor.externalLink}>
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </Link>
                        </div>
                        : sponsor.usesSponsorPage ?
                          <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                            <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`}>
                              <img src={sponsor.logo} alt={sponsor.name} />
                            </Link>
                          </div>
                          :
                          <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </div>
                    )
                  })}
                </div>
              )
            }
            case 'expo-hall': {
              return (
                <div className={`${styles.expoContainer} px-6`} key={tierIndex}>
                  {sponsors.map((sponsor, index) => {
                    return (
                      sponsor.externalLink ?
                        <div className={`
                          ${styles.imageBox} 
                          ${tier.expoHallSize === 'large' ? styles.large : tier.expoHallSize === 'medium' ? styles.medium : styles.small}`}
                          key={`${s.tier.label}-${index}`}
                        >
                          <Link to={sponsor.externalLink}>
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </Link>
                        </div>
                        : sponsor.usesSponsorPage ?
                          <div className={`
                            ${styles.imageBox} 
                            ${tier.expoHallSize === 'large' ? styles.large : tier.expoHallSize === 'medium' ? styles.medium : styles.small}`}
                            key={`${s.tier.label}-${index}`}
                          >
                            <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`}>
                              <img src={sponsor.logo} alt={sponsor.name} />
                            </Link>
                          </div>
                          :
                          <div className={`
                            ${styles.imageBox} 
                            ${tier.expoHallSize === 'large' ? styles.large : tier.expoHallSize === 'medium' ? styles.medium : styles.small}`}
                            key={`${s.tier.label}-${index}`}
                          >
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </div>
                    )
                  })}
                </div>
              )
            }
            case 'carousel': {
              if (page === 'lobby' && !tier.lobby.display) {
                return null
              } else {
                const sliderSettings = {
                  autoplay: true,
                  autoplaySpeed: 5000,
                  infinite: true,
                  className: 'sponsor-carousel',
                  dots: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
                };
                return (
                  <div className={`${tierIndex === 0 ? styles.firstContainer : ''} ${styles.carouselContainer}`} key={tierIndex}>
                    <span style={{ marginBottom: '0' }}><b>{tier.widgetTitle}</b></span>
                    <Slider {...sliderSettings}>
                      {sponsors.map((sponsor, index) => {
                        return (
                          sponsor.externalLink ?
                            <Link to={sponsor.externalLink} key={`${s.tier.label}-${index}`}>
                              <img src={sponsor.advertiseImage ? sponsor.advertiseImage : sponsor.logo} alt={sponsor.name} />
                            </Link>
                            :
                            sponsor.usesSponsorPage ?
                              <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`} key={`${s.tier.label}-${index}`}>
                                <img src={sponsor.advertiseImage ? sponsor.advertiseImage : sponsor.logo} alt={sponsor.name} />
                              </Link>
                              :
                              <img src={sponsor.advertiseImage ? sponsor.advertiseImage : sponsor.logo} alt={sponsor.name} />
                        )
                      })}
                    </Slider>
                  </div>

                )
              }
            }
          }
        } else {
          return null;
        }
      })}
      {page === 'lobby' && button.text && button.link && renderButton &&
        <Link className={styles.link} to={button.link}>
          <button className={`${styles.button} button is-large`}>
            {button.text}
          </button>
        </Link>
      }
    </React.Fragment>
  )
}

export default SponsorComponent;