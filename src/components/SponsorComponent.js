import React from 'react'
import { connect } from "react-redux";
import Slider from "react-slick";
import Link from '../components/Link'
import { getSponsorURL } from '../utils/urlFormating'

import styles from '../styles/sponsor.module.scss'

const SponsorComponent = ({ page, sponsorsState, tiers, lobbyButton }) => {
  let renderButton = false;
  return (
    <React.Fragment>
      {sponsorsState.map((s, tierIndex) => {
        const sponsors = s.sponsors;
        const tier = tiers.find(t => t.id === s.tier[0].value);
        if (!tier) return null;
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
                    {tier.widgetTitle &&
                      <span><b>{tier.widgetTitle}</b></span>
                    }
                    {sponsors.map((sponsor, index) => {
                      return (
                        sponsor.externalLink ?
                          <Link to={sponsor.externalLink} key={`${s.tier.label}-${index}`}>
                            <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                          </Link>
                          :
                          sponsor.usesSponsorPage ?
                            <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`} key={`${s.tier.label}-${index}`}>
                              <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                            </Link>
                            :
                            <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
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
                    {tier.widgetTitle &&
                      <span><b>{tier.widgetTitle}</b></span>
                    }
                    {sponsors.map((sponsor, index) => {
                      if (page === 'event' && !sponsor.showLogoInEventPage) return null
                      return (
                        sponsor.externalLink ?
                          <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                            <Link to={sponsor.externalLink}>
                              <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                            </Link>
                          </div>
                          : sponsor.usesSponsorPage ?
                            <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                              <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`}>
                                <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                              </Link>
                            </div>
                            :
                            <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                              <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
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
                              <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                            </Link>
                          </div>
                          :
                          <div className={styles.imageBox} key={`${s.tier.label}-${index}`}>
                            <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                          </div>
                    )
                  })}
                </div>
              )
            }
            case 'expo-hall': {
              return tier.expoHallPage?.display === true && (
                <div className={`${styles.expoContainer} px-6`} key={tierIndex}>
                  {sponsors.map((sponsor, index) => {
                    return (
                      sponsor.externalLink ?
                        <div className={`
                          ${styles.imageBox} 
                          ${tier.expoHallPage?.expoHallTemplate === 'big-images' ? styles.large : tier.expoHallPage?.expoHallTemplate === 'medium-images' ? styles.medium : styles.small}`}
                          key={`${s.tier.label}-${index}`}
                        >
                          <Link to={sponsor.externalLink}>
                            <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                          </Link>
                        </div>
                        : sponsor.usesSponsorPage ?
                          <div className={`
                          ${styles.imageBox} 
                          ${tier.expoHallPage?.expoHallTemplate === 'big-images' ? styles.large : tier.expoHallPage?.expoHallTemplate === 'medium-images' ? styles.medium : styles.small}`}
                            key={`${s.tier.label}-${index}`}
                          >
                            <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`}>
                              <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
                            </Link>
                          </div>
                          :
                          <div className={`
                          ${styles.imageBox} 
                          ${tier.expoHallPage?.expoHallTemplate === 'big-images' ? styles.large : tier.expoHallPage?.expoHallTemplate === 'medium-images' ? styles.medium : styles.small}`}
                            key={`${s.tier.label}-${index}`}
                          >
                            <img src={sponsor.logo.file} alt={sponsor.logo.alt} />
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
                    {tier.widgetTitle &&
                      <span style={{ marginBottom: '0' }}><b>{tier.widgetTitle}</b></span>
                    }
                    <Slider {...sliderSettings}>
                      {sponsors.map((sponsor, index) => {
                        const img = sponsor.advertiseImage ? sponsor.advertiseImage : sponsor.logo;
                        return (
                          sponsor.externalLink ?
                            <Link to={sponsor.externalLink} key={`${s.tier.label}-${index}`}>
                              <img src={img.file} alt={img.alt} />
                            </Link>
                            :
                            sponsor.usesSponsorPage ?
                              <Link to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`} key={`${s.tier.label}-${index}`}>
                                <img src={img.file} alt={img.alt} />
                              </Link>
                              :
                              <Link key={`${s.tier.label}-${index}`}>
                                <img src={img.file} alt={img.alt} />
                              </Link>
                        )
                      })}
                    </Slider>
                  </div>

                )
              }
            }
            default:
              return null;
          }
        } else {
          return null;
        }
      })}
      {page === 'lobby' && lobbyButton.text && lobbyButton.link && renderButton &&
        <Link className={styles.link} to={lobbyButton.link}>
          <button className={`${styles.button} button is-large`}>
            {lobbyButton.text}
          </button>
        </Link>
      }
    </React.Fragment>
  )
};

const mapStateToProps = ({ sponsorState }) => ({
  sponsorsState: sponsorState.sponsors,
  tiers: sponsorState.tiers,
  lobbyButton: sponsorState.lobbyButton
});

export default connect(mapStateToProps, {})(SponsorComponent);