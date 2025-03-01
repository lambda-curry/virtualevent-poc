import React, { useEffect, useState, useRef } from "react";
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

const MarketingHeroComponent = ({ siteSettings, summit_phase, isLoggedUser, summit, location }) => {

  const sliderRef = useRef(null);
  const [sliderHeight, setSliderHeight] = useState(424);

  const onResize = () => {
    setSliderHeight(sliderRef.current.clientHeight);
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const getBackURL = () => {
    let defaultLocation = getEnvVariable(AUTHORIZED_DEFAULT_PATH)
      ? getEnvVariable(AUTHORIZED_DEFAULT_PATH)
      : "/a/";
    let backUrl = location.state?.backUrl
      ? location.state.backUrl
      : defaultLocation;
    return URI.encode(backUrl);
  };

  const onClickLogin = () => {
    doLogin(getBackURL());
  };

  const getButtons = () => {

    const path = getEnvVariable(AUTHORIZED_DEFAULT_PATH) || '/a/';
    const { registerButton, loginButton } = siteSettings.heroBanner.buttons;

    if (summit_phase >= PHASES.DURING && isLoggedUser) {
      return (
        <>
          {registerButton.display &&
            (
              <span className={styles.link}>
                <RegistrationLiteComponent location={location} />
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
        {registerButton.display && !summit.invite_only_registration &&
          (
            <span className={styles.link}>
              <RegistrationLiteComponent location={location} />
            </span>
          )}
        {loginButton.display && !isLoggedUser && (
          <button className={`${styles.button} button is-large`} onClick={() => onClickLogin()}>
            <i className={`fa fa-2x fa-sign-in icon is-large`} />
            <b>{loginButton.text}</b>
          </button>
        )}
      </>
    );
  };

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
            backgroundImage: siteSettings.heroBanner.background?.file
              ? `url(${siteSettings.heroBanner.background.file})`
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
                  display: siteSettings.heroBanner.dateLayout
                    ? ""
                    : "inline",
                  transform: siteSettings.heroBanner.dateLayout
                    ? "skew(-25deg)"
                    : "skew(0deg)",
                }}
              >
                {siteSettings.heroBanner.dateLayout ?
                <div style={{transform: "skew(25deg)"}}>{siteSettings.heroBanner.date}</div>
                :
                <div style={{transform: "skew(0deg)"}}>
                  <span>{siteSettings.heroBanner.date}</span>
                </div>
                }
              </div>
              <h4>{siteSettings.heroBanner.time}</h4>
              <div className={styles.heroButtons}>
                {getButtons()}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.rightColumn} column is-6 px-0`} id="marketing-slider" ref={sliderRef}>
          {siteSettings.heroBanner.images.length > 1 ?
            <Slider {...sliderSettings}>
              {siteSettings.heroBanner.images.map((img, index) => {
                return (
                  <div key={index}>
                    <div className={styles.imageSlider} aria-label={img.alt} style={{ backgroundImage: `url(${img.file})`, height: sliderHeight, marginBottom: -6 }} />
                  </div>
                );
              })}
            </Slider>
            :
            <div className={styles.singleImage} aria-label={siteSettings.heroBanner.images[0].alt} style={{ backgroundImage: `url(${siteSettings.heroBanner.images[0].file})`}} >
            </div>
          }
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = ({ clockState, settingState, userState, summitState }) => ({
  summit_phase: clockState.summit_phase,
  summit: summitState.summit,
  siteSettings: settingState.siteSettings,
  userProfile: userState.userProfile
});

export default connect(mapStateToProps, null)(MarketingHeroComponent);
