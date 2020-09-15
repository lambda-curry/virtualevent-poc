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
  <section className={`${styles.nmiHero}`}>
    <div className={`${styles.nmiHeroColumns} columns`} style={{ backgroundImage: `url(${HeroContent.heroBanner.background})` }}>
      <div className={`column is-full px-0 py-0`}>
        <div className={`${styles.nmiHeroContainer} hero-body`}>
          <div className="container">
            <h1 className={`${styles.title}`}>
              {HeroContent.heroBanner.title}
            </h1>
            <h2 className={`${styles.subtitle}`}>
              {HeroContent.heroBanner.subTitle}
            </h2>
            <span className={`${styles.date}`}>
              {HeroContent.heroBanner.date}
            </span>
            <div className>
              {HeroContent.heroBanner.buttons.loginButton.display &&
                <a className={styles.nmiLink} onClick={() => onClickLogin(location)}></a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

)

export default NMIHeroComponent;