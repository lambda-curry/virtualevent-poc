import React from 'react'
import {connect} from "react-redux";

import styles from '../styles/lobby-hero.module.scss'

const LobbyHeroComponent = ({homeSettings}) => (
  <section className="hero">
    <div className={`${styles.heroColumns} columns`}>
      <div className={`${styles.leftColumn} column is-black`}>
        <div className={`${styles.heroContainer} hero-body`}>
          <div className="container">
            <h1 className="title">
              {homeSettings.homeHero.title}
            </h1>
            <h2 className="subtitle">
              {homeSettings.homeHero.subTitle}
            </h2>
          </div>
        </div>
      </div>
      <div className={`${styles.midColumn} column is-1 is-info`} />
      <div className={`${styles.rightColumn} column is-danger`} style={{ backgroundImage: `url(${homeSettings.homeHero.image.file})` }} />
    </div>
  </section>
);


const mapStateToProps = ({ settingState }) => ({
  homeSettings: settingState.homeSettings,
});

export default connect(mapStateToProps, { } )(LobbyHeroComponent);