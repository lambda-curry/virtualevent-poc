import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'
import Masonry from 'react-masonry-css'
import Slider from "react-slick";
import Layout from '../components/Layout'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent"
import DisqusComponent from '../components/DisqusComponent'
import Countdown from '../components/Countdown'
import Content, { HTMLContent } from '../components/Content'

import '../styles/style.scss'

import { PHASES } from '../utils/phasesUtils'

import MarketingSite from '../content/marketing-site.json'
import SummitObject from '../content/summit.json'

import { getDisqusSSO } from '../actions/user-actions'

import styles from "../styles/marketing.module.scss"

export const MarketingPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    const sliderSettings = {
      autoplay: true,
      arrows: false,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  }

  componentWillMount() {
    if (MarketingSite.leftColumn.disqus && this.props.isLoggedUser) {
      this.props.getDisqusSSO();
    }
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
        onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      }
    }

    return (
      <div className="columns" id="marketing-columns">
        <div className="column is-half" >
          <div className={`columns ${styles.isVertical}`}>
            <div className={`column is-full px-6 py-6 ${styles.heroImage}`} >
              Imagen de nintendo
            </div>
            <div className={`column is-full px-6 py-6 ${styles.heroWidgets}`} >
              {MarketingSite.leftColumn.schedule &&
                <React.Fragment>
                  <h2 style={{ fontWeight: 'bold' }}>Full Event Schedule</h2>
                  <ScheduleLiteComponent
                    {...scheduleProps}
                    page="marketing-site"
                    accessToken={loggedUser.accessToken}
                    landscape={true}
                    showAllEvents={true}
                    eventCount={100}
                  />
                </React.Fragment>
              }
              {MarketingSite.leftColumn.disqus &&
                <React.Fragment>
                  <h2 style={{ fontWeight: 'bold' }}>Join the conversation</h2>
                  <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
                </React.Fragment>
              }
            </div>
          </div>
        </div>
        <div className="column is-half" >
          <div className={`columns ${styles.isVertical}`}>
            <div className={`column is-full px-0 pb-0 ${styles.heroData}`} >
              <div className="container">
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
                {/* <div className={styles.heroButtons}>
                  {summit_phase >= PHASES.DURING && isLoggedUser ?
                    <a className={styles.link} href={`${envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/'}`} target="_blank" rel="noreferrer">
                      <button className={`${styles.button} button is-large`}>
                        <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                        <b>Enter</b>
                      </button>
                    </a>
                    :
                    <React.Fragment>
                      {MarketingSite.heroBanner.buttons.registerButton.display &&
                        <a className={styles.link} href={`${envVariables.REGISTRATION_BASE_URL}/a/${summit.slug}/`} target="_blank" rel="noreferrer">
                          <button className={`${styles.button} button is-large`}>
                            <i className={`fa fa-2x fa-edit icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.registerButton.text}</b>
                          </button>
                        </a>
                      }
                      {MarketingSite.heroBanner.buttons.loginButton.display &&
                        <a className={styles.link}>
                          <button className={`${styles.button} button is-large`} onClick={() => this.onClickLogin()}>
                            <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.loginButton.text}</b>
                          </button>
                        </a>
                      }
                    </React.Fragment>
                  }
                </div> */}
              </div>
              <div className={`${styles.countdown}`}>
                Countdown
                {summit && <Countdown summit={summit} />}
              </div>
            </div>
            <div className={`column is-full px-0 pt-0 pb-5 ${styles.heroMasonry}`} >
              <Masonry
                breakpointCols={2}
                className={`my-masonry-grid ${styles.masonry}`}
                columnClassName={`my-masonry-grid_column ${styles.column}`}>
                {MarketingSite.sponsors.map((item, index) => {
                  if (item.image) {
                    return (
                      <div key={index}>
                        <img src={item.image} />
                      </div>
                    )
                  } else if (item.images) {
                    return (
                      <Slider {...this.sliderSettings}>
                        {item.images.map((img, index) => {
                          return (
                            <div key={index}>
                              <div className={styles.imageSlider} style={{ backgroundImage: `url(${img.image})` }}>
                              </div>
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