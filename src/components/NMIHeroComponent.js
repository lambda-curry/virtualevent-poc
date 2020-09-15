import React from 'react'
import { connect } from "react-redux";
import { doLogin } from "openstack-uicore-foundation/lib/methods";
import URI from "urijs";

import { PHASES } from '../utils/phasesUtils';
import envVariables from '../utils/envVariables'

import HeroContent from '../content/marketing-site.json'
import styles from '../styles/lobby-hero.module.scss'

const getBackURL = (location) => {
  let defaultLocation = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';
  let backUrl = location.state?.backUrl ? location.state.backUrl : defaultLocation;
  return URI.encode(backUrl);
}

const onClickLogin = (location) => {
  doLogin(getBackURL(location));
}

const NMIHeroComponent = ({ location, isLoggedUser, summit, summit_phase }) => (
  <section className={`${styles.nmiHero} py-0 px-0`}>
    <video className={`${styles.nmiHeroVideo} is-hidden-mobile`} preload="auto" autoPlay loop muted="muted" volume="0">
      <source src="img/Milky_Way_Galaxy.mp4" type="video/mp4" />
    </video>
    <div className="is-hidden-tablet">
      <img src="img/AC-SMAC20_Marketing_Header-Mobile.png" />
    </div>
    <div className={`${styles.nmiHeroColumns} columns`} style={{ backgroundImage: `url(${HeroContent.heroBanner.background})` }}>
      <div className={`column is-full px-0 py-0`}>
        <div className={`${styles.nmiHeroContainer} hero-body`}>
          {HeroContent.heroBanner.buttons.loginButton.display &&
            <a className={styles.nmiLink} onClick={() => onClickLogin(location)}></a>
          }
        </div>
      </div>
    </div>
  </section>

)

export default NMIHeroComponent;