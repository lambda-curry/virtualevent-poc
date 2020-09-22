import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'
import URI from "urijs";
import Masonry from 'react-masonry-css'
import Slider from "react-slick";
import Layout from '../components/Layout'
import NMIHeroComponent from '../components/NMIHeroComponent'
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
      autoplaySpeed: 5000,
      arrows: false,
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <React.Fragment>
        <NMIHeroComponent summit={summit} isLoggedUser={isLoggedUser} location={location} />
        <div className="columns" id="marketing-columns">
          <div className={`column is-half ${styles.heroWidgets}`} style={{ position: 'relative' }}>
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
            {MarketingSite.leftColumn.image.display &&
              <React.Fragment>
                {MarketingSite.leftColumn.image.title &&
                  <h2><b>{MarketingSite.leftColumn.image.title}</b></h2>
                }
                <br />
                <img src={MarketingSite.leftColumn.image.src} />
              </React.Fragment>
            }
            {MarketingSite.leftColumn.disqus.display &&
              <div className={styles.disqusBackground}>
                {MarketingSite.leftColumn.disqus.title &&
                  <h2><b>{MarketingSite.leftColumn.disqus.title}</b></h2>
                }
                <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
              </div>
            }
          </div>
          <div className={`column is-half px-0 pt-0 pb-5 ${styles.heroMasonry}`} >
            <Countdown summit={summit} />
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
      </React.Fragment>
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

const mapStateToProps = ({ clockState, loggedUserState, userState }) => ({
  summit_phase: clockState.summit_phase,
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