import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'
import URI from "urijs";
import Masonry from 'react-masonry-css'
import Slider from "react-slick";
import Layout from '../components/Layout'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent"
import DisqusComponent from '../components/DisqusComponent'
import Countdown from '../components/Countdown'
import Link from '../components/Link'
import Content, { HTMLContent } from '../components/Content'

import { doLogin } from "openstack-uicore-foundation/lib/methods";

import '../styles/style.scss'

import { PHASES } from '../utils/phasesUtils'
import envVariables from '../utils/envVariables'

import MarketingSite from '../content/marketing-site.json'
import SummitObject from '../content/summit.json'

import { getDisqusSSO } from '../actions/user-actions'

import styles from "../styles/marketing.module.scss"

export const MarketingPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (MarketingSite.leftColumn.disqus && this.props.isLoggedUser) {
      this.props.getDisqusSSO();
    }
  }

  getBackURL = () => {
    let { location } = this.props;
    let defaultLocation = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';
    let backUrl = location.state?.backUrl ? location.state.backUrl : defaultLocation;
    return URI.encode(backUrl);
  }

  onClickLogin = () => {
    doLogin(this.getBackURL());
  }

  render() {
    let { content, contentComponent, summit_phase, user, loggedUser, isLoggedUser, location } = this.props;
    let { summit } = SummitObject;

    const PageContent = contentComponent || Content

    let scheduleProps = {}
    if (MarketingSite.leftColumn.schedule &&
      isLoggedUser && summit_phase !== PHASES.BEFORE) {
      scheduleProps = {
        ...scheduleProps,
        onEventClick: (ev) => navigate(`/a/keynote/${ev.id}`),
      }
    }

    const sliderSettings = {
      autoplay: true,
      arrows: true,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div className="columns" id="marketing-columns">
        <div className="column is-half" >
          <div className={`columns ${styles.isVertical}`}>
            <div className={`column is-full ${styles.heroImage}`} >
              <img src="/img/NinSMAC20_Marketing_Header_Mario_TPT.png" />
            </div>
            <div className={`column is-full px-6 pt-0 pb-6 ${styles.heroWidgets}`} >
              {MarketingSite.leftColumn.schedule.display &&
                <React.Fragment>
                  {MarketingSite.leftColumn.schedule.title && 
                    <h2><b>{MarketingSite.leftColumn.schedule.title}</b></h2>
                  }
                  <ScheduleLiteComponent
                    {...scheduleProps}
                    page="marketing-site"
                    accessToken={loggedUser.accessToken}
                    landscape={true}
                    showNav={true}
                    showAllEvents={true}
                    eventCount={100}
                  />
                </React.Fragment>
              }
              {MarketingSite.leftColumn.disqus.display &&
                <React.Fragment>
                  {MarketingSite.leftColumn.disqus.title && 
                    <h2><b>{MarketingSite.leftColumn.disqus.title}</b></h2>
                  }
                  <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
                </React.Fragment>
              }
              {MarketingSite.leftColumn.image.display &&
                <React.Fragment>
                  {MarketingSite.leftColumn.image.title && 
                    <h2><b>{MarketingSite.leftColumn.image.title}</b></h2>
                  }
                  <br />
                  <img src={MarketingSite.leftColumn.image.src} />
                </React.Fragment>
              }
            </div>
          </div>
        </div>
        <div className="column is-half" >
          <div className={`columns ${styles.isVertical}`}>
            <div className={`column is-full px-0 pb-0 ${styles.heroData}`} >
              <div className="px-6 pb-6">
                <h1 className={`${styles.title}`}>
                  {MarketingSite.heroBanner.title}
                </h1>
                <h2 className={`${styles.subtitle}`}>
                  {MarketingSite.heroBanner.subTitle}
                </h2>
                <div className={styles.date} style={{ backgroundColor: MarketingSite.heroBanner.dateLayout ? 'var(--color_secondary)' : '' }}>
                  <div>{MarketingSite.heroBanner.date}</div>
                </div>
                <h4>{MarketingSite.heroBanner.time}</h4>
                <div className={styles.heroButtons}>
                    <a className={styles.link} href={`${envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/'}`} target="_blank" rel="noreferrer">
                      <button className={`${styles.button} button is-large`}>
                        <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                        <b>Enter</b>
                      </button>
                    </a>
                </div>
              </div>
              <div>
                {summit && <Countdown summit={summit} />}
              </div>
            </div>
            <div className={`column is-full px-0 pt-0 pb-5 ${styles.heroMasonry}`} >
              <Masonry
                breakpointCols={2}
                className={`my-masonry-grid ${styles.masonry}`}
                columnClassName={`my-masonry-grid_column ${styles.column}`}>
                {MarketingSite.sponsors.map((item, index) => {
                  if (item.images.length === 1) {
                    return (
                      <div className={'single'} key={index}>
                        {item.images[0].link ?
                          <Link to={item.images[0].link}>
                            <img src={item.images[0].image} />
                          </Link>
                          :
                          <img src={item.images[0].image} />
                        }
                      </div>
                    )
                  } else if (item.images.length > 1) {
                    return (
                      <Slider {...sliderSettings}>
                        {item.images.map((img, index) => {
                          return (
                            <div className={styles.imageSlider} key={index}>
                              {img.link ?
                                <Link to={img.link}>
                                  <img src={img.image} />
                                </Link>
                                :
                                <img src={img.image} />
                              }
                            </div>
                          )
                        })}
                      </Slider>
                    )
                  }
                })}
              </Masonry>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

MarketingPageTemplate.propTypes = {
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
}

const MarketingPage = ({ location, data, summit_phase, user, loggedUser, isLoggedUser, getDisqusSSO }) => {
  const { frontmatter, html } = data.markdownRemark

  return (
    <Layout marketing={true}>
      <MarketingPageTemplate
        contentComponent={HTMLContent}
        content={html}
        location={location}
        summit_phase={summit_phase}
        user={user}
        loggedUser={loggedUser}
        isLoggedUser={isLoggedUser}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

MarketingPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  loggedUser: PropTypes.object,
  isLoggedUser: PropTypes.bool,
  getSummitData: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = ({ summitState, loggedUserState, userState }) => ({
  summit_phase: summitState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  loggedUser: loggedUserState,
  user: userState,
})

export default connect(mapStateToProps, {
  getDisqusSSO
})(MarketingPage)

export const marketingPageQuery = graphql`
  query MarketingPageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
      }
    }
  }
`