import React from 'react'
import Slider from "react-slick";
import URI from "urijs";
import { doLogin } from "openstack-uicore-foundation/lib/methods";

import MarketingSite from '../content/marketing-site.json'
import styles from '../styles/lobby-hero.module.scss'

import envVariables from '../utils/envVariables'

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

const getBackURL = () => {
  let defaultLocation = '/a/';
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

const onClickLogin = () => {
  doLogin(getBackURL());
}

const LobbyHeroMarketing = ({ ...props }) => (
  <section className={styles.heroMarketing}>
    <div className={`${styles.heroMarketingColumns} columns is-gapless`}>
      <div className={`${styles.leftColumn} column is-6 is-black`}>
        <div className={`${styles.heroMarketingContainer} hero-body`}>
          <div className="container">
            <h1 className="title">
              {MarketingSite.heroBanner.title}
              <br />
              {MarketingSite.heroBanner.date}
            </h1>
            <h2 className="subtitle">
              {MarketingSite.heroBanner.subTitle}
            </h2>
            <div className={styles.heroButtons}>
              <a className={styles.link} href={`${envVariables.REGISTRATION_BASE_URL}/a/${props.summit.slug}/registration/start`} target="_blank" rel="noreferrer">
                <button className={`${styles.button} button is-large`}>
                  <i className={`fa fa-2x fa-edit icon is-large`}></i>
                  <b>Register now</b>
                </button>
              </a>
              <a className={styles.link}>
                <button className={`${styles.button} button is-large`} onClick={() => onClickLogin()}>
                  <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                  <b>Log in</b>
                </button>
              </a>
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

export default LobbyHeroMarketing