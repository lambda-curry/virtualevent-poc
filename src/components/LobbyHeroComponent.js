import React from 'react'
import {connect} from "react-redux";

import styles from '../styles/lobby-hero.module.scss'

const LobbyHeroComponent = ({homeSettings}) => (
  <div className="hero">
    <div className={`${styles.heroColumns} columns`}>
      <div className={`${styles.leftColumn} column is-black`}>
        <div className={`${styles.heroContainer} hero-body`}>
          <div className="container">
            <h1 className="title">
              {homeSettings.homeHero.title}
            </h1>
            <p className={`${styles.subtitle} subtitle`}>
              {homeSettings.homeHero.subTitle}
            </p>
          </div>
        </div>
      </div>
      <div className={`${styles.rightColumn} column is-danger`} style={{ backgroundImage: `url(${homeSettings.homeHero.image.file})` }} />
    </div>
  </div>
);


const mapStateToProps = ({ settingState }) => ({
  homeSettings: settingState.homeSettings,
});

export default connect(mapStateToProps, { } )(LobbyHeroComponent);