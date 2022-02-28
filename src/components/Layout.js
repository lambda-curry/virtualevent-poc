import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ClockComponent from '../components/ClockComponent';
import useSiteMetadata from './SiteMetadata';
import { withPrefix } from 'gatsby';

import '../styles/bulma.scss';

const TemplateWrapper = ({ children, location, marketing, summit, favicons }) => {
  const { title, description } = useSiteMetadata();
  const [isFocus, setIsFocus] = useState(true);

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

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
        {favicons?.favicon180 &&
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${withPrefix('/')}${favicons.favicon180.substring(1)}`}
          />
        }
        {favicons?.favicon32 &&
          <link
            rel="icon"
            type="image/png"
            href={`${withPrefix('/')}${favicons.favicon32.substring(1)}`}
            sizes="32x32"
          />
        }
        {favicons?.favicon16 &&
          <link
            rel="icon"
            type="image/png"
            href={`${withPrefix('/')}${favicons.favicon16.substring(1)}`}
            sizes="16x16"
          />
        }

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
      <Header location={location} />
      <ClockComponent active={isFocus} summit={summit} />
      <div id="content-wrapper">{children}</div>
      <Footer marketing={marketing} />
    </div>
  )
};

const mapStateToProps = ({ summitState, settingState }) => ({
  summit: summitState.summit,
  favicons: settingState.favicons
});

export default connect(mapStateToProps, {})(TemplateWrapper);