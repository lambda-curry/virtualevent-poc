import React from 'react'
import { connect } from "react-redux";
import Slider from "react-slick";
import URI from "urijs";
import { doLogin } from "openstack-uicore-foundation/lib/methods";

import MarketingSite from '../content/marketing-site.json'
import { PHASES } from '../utils/phasesUtils';
import styles from '../styles/lobby-hero.module.scss'

import envVariables from '../utils/envVariables'

class MarketingHeroComponent extends React.Component {

  getBackURL = () => {
    let { location } = this.props;
    let defaultLocation = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';
    let backUrl = location.state?.backUrl ? location.state.backUrl : defaultLocation;
    return URI.encode(backUrl);
  }

  onClickLogin = () => {
    doLogin(this.getBackURL());
  }

  render() {

    const { summit, summit_phase, isLoggedUser } = this.props;

    const sliderSettings = {
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <section className={styles.heroMarketing}>
        <div className={`${styles.heroMarketingColumns} columns is-gapless`}>
          <div className={`${styles.leftColumn} column is-6 px-0 py-0 is-black`}
            style={{ backgroundImage: MarketingSite.heroBanner.background ? `url(${MarketingSite.heroBanner.background})` : '' }}>
            <div className={`${styles.heroMarketingContainer} hero-body`}>
              <div className="container">
                <h1 className="title">
                  {MarketingSite.heroBanner.title}
                </h1>
                <h2 className="subtitle">
                  {MarketingSite.heroBanner.subTitle}
                </h2>
                {MarketingSite.heroBanner.dateLayout &&
                  <div className={styles.date}>
                    <div>{MarketingSite.heroBanner.date}</div>
                  </div>
                }
                <h4>{MarketingSite.heroBanner.time}</h4>
                <div className={styles.heroButtons}>
                  {summit_phase >= PHASES.DURING && isLoggedUser ?
                    <a className={styles.link} href={`${envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/'}`} target="_blank" rel="noreferrer">
                      <button className={`${styles.button} button is-large`}>
                        <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                        <b>Enter</b>
                      </button>
                    </a>
                    :
                    <React.Fragment>
                      {MarketingSite.heroBanner.buttons.registerButton.display &&
                        <a className={`${styles.link} ${styles.register}`} href={`${envVariables.REGISTRATION_BASE_URL}/a/${summit.slug}/`} target="_blank" rel="noreferrer">
                          <button className={`${styles.button} button is-large`}>
                            <i className={`fa fa-2x fa-edit icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.registerButton.text}</b>
                          </button>
                        </a>
                      }
                      {MarketingSite.heroBanner.buttons.loginButton.display && !isLoggedUser &&
                        <a className={styles.link}>
                          <button className={`${styles.button} button is-large`} onClick={() => this.onClickLogin()}>
                            <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.loginButton.text}</b>
                          </button>
                        </a>
                      }
                    </React.Fragment>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.rightColumn} column is-6 px-0`} id="marketing-slider">
            <Slider {...sliderSettings}>
              {MarketingSite.heroBanner.images.map((img, index) => {
                return (
                  <div key={index}>
                    <div className={styles.imageSlider} style={{ backgroundImage: `url(${img.image})` }}>
                    </div>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      </section>

    )
  }
}

const mapStateToProps = ({ clockState }) => ({
  summit_phase: clockState.summit_phase,
})

export default connect(mapStateToProps, null)(MarketingHeroComponent);