import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ClockComponent from '../components/ClockComponent'
import useSiteMetadata from './SiteMetadata'
import { withPrefix } from 'gatsby'

import SummitObject from '../content/summit.json'
import { updateClock } from "../actions/clock-actions";
import { getUserProfile } from "../actions/user-actions";

// import "../styles/all.scss"
// import "../styles/palette.scss"
import "../styles/bulma.scss"

const TemplateWrapper = ({ children, marketing, updateClock, getUserProfile }) => {

  const { title, description } = useSiteMetadata();
  const { summit } = SummitObject;

  const [seconds, setSeconds] = useState(0);

  let interval = useRef(null);

  const onFocus = useCallback(() => {
    clearInterval(interval.current);
    console.log('seconds!', seconds);
    if (seconds > 20) {
      getUserProfile();
    } else if (seconds > 60) {
      updateClock();
    }
    setSeconds(0);
  }, [seconds]);

  const onBlur = useCallback(() => {
    interval.current = setInterval(
      () => setSeconds((prevSeconds) => prevSeconds + 1),
      1000
    );
  }, []);

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  });

  return (
    <div id="container">
      <Helmet>
        <html lang="en" />
        <title>{`${summit.name} - ${title}`}</title>
        <meta name="description" content={description} />

        <link
          rel="icon"
          type="image/png"
          href={`${withPrefix('/')}img/favicon.png`}
          sizes="16x16"
        />

        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta
          property="og:image"
          content={`${withPrefix('/')}img/og-image.jpg`}
        />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Helmet>
      <Header />
      <ClockComponent summit={summit} />
      <div id="content-wrapper">{children}</div>
      <Footer marketing={marketing} />
    </div>
  )
}

export default connect(null, { updateClock, getUserProfile })(TemplateWrapper);