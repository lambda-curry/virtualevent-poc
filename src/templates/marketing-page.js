import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'
import Masonry from 'react-masonry-css'
import Layout from '../components/Layout'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent"
import DisqusComponent from '../components/DisqusComponent'
import Countdown from '../components/Countdown'
import Link from '../components/Link'
import Content, { HTMLContent } from '../components/Content'

import '../styles/style.scss'

import { PHASES } from '../utils/phasesUtils'

import MarketingSite from '../content/marketing-site.json'
import SummitObject from '../content/summit.json'

import { getDisqusSSO } from '../actions/user-actions'

export const MarketingPageTemplate = class extends React.Component {

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
      scheduleProps = { ...scheduleProps,
        onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      }
    }

    return (
      <React.Fragment>
        <MarketingHeroComponent summit={summit} isLoggedUser={isLoggedUser} location={location}/>
        {summit && <Countdown summit={summit} />}
        <div className="columns" id="marketing-columns">
          <div className="column is-half px-6 pt-6 pb-0" style={{ position: 'relative' }}>
            {MarketingSite.leftColumn.schedule.display &&
              <React.Fragment>
                <h2><b>{MarketingSite.leftColumn.schedule.title}</b></h2>
                <ScheduleLiteComponent
                  {...scheduleProps}
                  page="marketing-site"
                  accessToken={loggedUser.accessToken}
                  landscape={true}
                  showAllEvents={true}
                  showNav={false}
                  eventCount={300}
                />
              </React.Fragment>
            }
            {MarketingSite.leftColumn.disqus.display &&
              <React.Fragment>
                <h2><b>{MarketingSite.leftColumn.disqus.title}</b></h2>                            
                <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
              </React.Fragment>
            }
            {MarketingSite.leftColumn.image.display &&
              <React.Fragment>
                <h2><b>{MarketingSite.leftColumn.image.title}</b></h2>
                <br />
                <img src={MarketingSite.leftColumn.image.src} />
              </React.Fragment>
            }
          </div>
          <div className="column is-half is-hidden-mobile px-0 pb-0">
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {MarketingSite.sponsors.map((item, index) => {
                if(item.image) {
                  return (
                    <div key={index}>
                      {item.link ?
                        <Link to={item.link}>
                          <img src={item.image} />
                        </Link>
                        :
                        <img src={item.image} />
                      }
                    </div>
                  )
                } else {
                  return null
                }                
              })}
            </Masonry>
          </div>
          <div className="column is-half is-hidden-tablet px-0 pb-0">
            <Masonry
              breakpointCols={1}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {MarketingSite.sponsors.map((item, index) => {
                if(item.image) {
                  return (
                    <div key={index}>
                      {item.link ?
                        <Link to={item.link}>
                          <img src={item.image} />
                        </Link>
                        :
                        <img src={item.image} />
                      }
                    </div>
                  )
                } else {
                  return null
                }                
              })}
            </Masonry>
          </div>
        </div>
        <PageContent content={content} />
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