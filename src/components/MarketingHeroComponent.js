import React from 'react'
import Slider from "react-slick";
import URI from "urijs";
import { doLogin } from "openstack-uicore-foundation/lib/methods";

import MarketingSite from '../content/marketing-site.json'
import styles from '../styles/lobby-hero.module.scss'

import envVariables from '../utils/envVariables'

class MarketingHeroComponent extends React.Component {

  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      timestamp: 0
    }

    const sliderSettings = {
      autoplay: true,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  }

  componentDidMount() {
    const { now } = this.props;
    this.setState({ timestamp: now });
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getBackURL = () => {
    let defaultLocation = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';
    let url = URI(window.location.href);
    let location = url.pathname();
    if (location === '/') location = defaultLocation
    let query = url.search(true);
    let fragment = url.fragment();
    let backUrl = query.hasOwnProperty('BackUrl') ? query['BackUrl'] : location;
    if (fragment !== null && fragment !== '') {
      backUrl += `#${fragment}`;
    }
    return backUrl;
  }

  onClickLogin = () => {
    doLogin(this.getBackURL());
  }

  tick = () => {
    const { timestamp } = this.state;
    this.setState({ timestamp: timestamp + 1 })
  };

  render() {

    const { summit, isLoggedUser } = this.props;
    const { timestamp } = this.state;

    return (
      <section className={styles.heroMarketing}>
        <div className={`${styles.heroMarketingColumns} columns is-gapless`}>
          <div className={`${styles.leftColumn} column is-6 is-black`}
            style={{ backgroundImage: MarketingSite.heroBanner.background ? `url(${MarketingSite.heroBanner.background})` : '' }}>
            <div className={`${styles.heroMarketingContainer} hero-body`}>
              <div className="container">
                <h1 className="title">
                  {MarketingSite.heroBanner.title}
                </h1>
                <h2 className="subtitle">
                  {MarketingSite.heroBanner.subTitle}
                </h2>
                <div className={styles.date} style={{ backgroundColor: MarketingSite.heroBanner.dateLayout ? 'var(--color_secondary)' : '' }}>
                  <div>{MarketingSite.heroBanner.date}</div>
                </div>
                <h4>{MarketingSite.heroBanner.time}</h4>
                <div className={styles.heroButtons}>
                  {summit.start_date - 300 < timestamp && isLoggedUser ?
                    <a className={styles.link} href={`${envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/'}`} target="_blank" rel="noreferrer">
                      <button className={`${styles.button} button is-large`}>
                        <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                        <b>Enter</b>
                      </button>
                    </a>
                    :
                    <React.Fragment>
                      {MarketingSite.heroBanner.buttons.registerButton.display &&
                        <a className={styles.link} href={`${envVariables.REGISTRATION_BASE_URL}/a/${summit.slug}/`} target="_blank" rel="noreferrer">
                          <button className={`${styles.button} button is-large`}>
                            <i className={`fa fa-2x fa-edit icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.registerButton.text}</b>
                          </button>
                        </a>
                      }
                      {MarketingSite.heroBanner.buttons.loginButton.display &&
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
            <Slider {...this.sliderSettings}>
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

export default MarketingHeroComponent