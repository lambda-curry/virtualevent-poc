import React from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import URI from "urijs";
import { doLogin } from "openstack-uicore-foundation/lib/methods";
import { PHASES } from "../utils/phasesUtils";
import {
  getEnvVariable,
  AUTHORIZED_DEFAULT_PATH,
} from "../utils/envVariables";
import Link from "../components/Link";
import RegistrationLiteComponent from "./RegistrationLiteComponent";

import styles from "../styles/lobby-hero.module.scss";

class MarketingHeroComponent extends React.Component {
  getBackURL = () => {
    let { location } = this.props;
    let defaultLocation = getEnvVariable(AUTHORIZED_DEFAULT_PATH)
      ? getEnvVariable(AUTHORIZED_DEFAULT_PATH)
      : "/a/";
    let backUrl = location.state?.backUrl
      ? location.state.backUrl
      : defaultLocation;
    return URI.encode(backUrl);
  };

  onClickLogin = () => {
    doLogin(this.getBackURL());
  };

  getButtons = () => {
    const { summit_phase, isLoggedUser, siteSettings } = this.props;
    const path = getEnvVariable(AUTHORIZED_DEFAULT_PATH) || '/a/';
    const {registerButton, loginButton} = siteSettings.heroBanner.buttons;

    if (summit_phase >= PHASES.DURING && isLoggedUser) {
      return (
        <>
        {registerButton.display &&
        (
          <span className={styles.link}>
            <RegistrationLiteComponent location={this.props.location} />
          </span>
        )}
        <Link className={styles.link} to={path}>
          <button className={`${styles.button} button is-large`}>
            <i className={`fa fa-2x fa-sign-in icon is-large`} />
            <b>Enter</b>
          </button>
        </Link>
        </>
      );
    }

    return (
        <>
          {registerButton.display &&
          (
            <span className={styles.link}>
              <RegistrationLiteComponent location={this.props.location} />
            </span>
          )}
          {loginButton.display && !isLoggedUser && (
              <button className={`${styles.button} button is-large`} onClick={() => this.onClickLogin()}>
                <i className={`fa fa-2x fa-sign-in icon is-large`} />
                <b>{loginButton.text}</b>
              </button>
          )}
        </>
    );
  };

  render() {
    const { siteSettings } = this.props;

    const sliderSettings = {
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <section className={styles.heroMarketing}>
        <div className={`${styles.heroMarketingColumns} columns is-gapless`}>
          <div
            className={`${styles.leftColumn} column is-6 is-black`}
            style={{
              backgroundImage: siteSettings.heroBanner.background
                ? `url(${siteSettings.heroBanner.background})`
                : "",
            }}
          >
            <div className={`${styles.heroMarketingContainer} hero-body`}>
              <div className="container">
                <h1 className="title">{siteSettings.heroBanner.title}</h1>
                <h2 className="subtitle">{siteSettings.heroBanner.subTitle}</h2>
                <div
                  className={styles.date}
                  style={{
                    backgroundColor: siteSettings.heroBanner.dateLayout
                      ? "var(--color_secondary)"
                      : "",
                  }}
                >
                  <div>{siteSettings.heroBanner.date}</div>
                </div>
                <h4>{siteSettings.heroBanner.time}</h4>
                <div className={styles.heroButtons}>                  
                  {this.getButtons()}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.rightColumn} column is-6 px-0`} id="marketing-slider">
            {siteSettings.heroBanner.images.length > 0 ?
              <Slider {...sliderSettings}>
                {siteSettings.heroBanner.images.map((img, index) => {
                  return (
                    <div key={index}>
                      <div className={styles.imageSlider} style={{ backgroundImage: `url(${img.image})` }} />
                    </div>
                  );
                })}
              </Slider>
              :
              <div>
                <div className={styles.imageSlider} style={{ backgroundImage: `url(${siteSettings.heroBanner.images[0].image})` }} />
              </div>
            }
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({ clockState, settingState, userState }) => ({
  summit_phase: clockState.summit_phase,
  siteSettings: settingState.siteSettings,
  userProfile: userState.userProfile
});

export default connect(mapStateToProps, null)(MarketingHeroComponent);
