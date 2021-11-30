import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ClockComponent from '../components/ClockComponent'
import useSiteMetadata from './SiteMetadata'
import { withPrefix } from 'gatsby'

import "../styles/bulma.scss"

const TemplateWrapper = ({ children, location, marketing, summit, favicon }) => {
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
        {favicon &&
          <link
            rel="icon"
            type="image/png"
            href={`${withPrefix('/')}${favicon.substring(1)}`}
            sizes="32x32"
          />
        }
        {favicon &&
          <link
            rel="shortcut icon"
            type="image/png"
            href={`${withPrefix('/')}${favicon.substring(1)}`}
          />
        }
        {favicon &&
          <link
            rel="mask-icon"
            href={`${withPrefix('/')}${`img/sf21-safari-pinned-tab.svg`}`}
            color="#6030bc">
          </link>
        }

        <meta name="theme-color" content="#6030bc" />

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
      <ClockComponent summit={summit} display={isFocus} />
      <div id="content-wrapper">{children}</div>
      <Footer marketing={marketing} />
    </div>
  )
};

const mapStateToProps = ({ summitState, settingState }) => ({
  summit: summitState.summit,
  favicon: settingState.favicon
});

export default connect(mapStateToProps, {})(TemplateWrapper);