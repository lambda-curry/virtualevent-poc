import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Redirect } from '@reach/router'
import { connect } from 'react-redux'
import Masonry from 'react-masonry-css'
import Layout from '../components/Layout'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent"
import DisqusComponent from '../components/DisqusComponent'
import Countdown from '../components/Countdown'
import Content, { HTMLContent } from '../components/Content'

import '../styles/style.scss'

import MarketingSite from '../content/marketing-site.json'
import SummitObject from '../content/summit.json'

import { getDisqusSSO } from '../actions/user-actions'

export const MarketingPageTemplate = class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let { isLoggedUser } = this.props;
    if (isLoggedUser) { this.props.getDisqusSSO(); }
  }

  render() {
    let { content, contentComponent, user, loggedUser, isLoggedUser } = this.props;
    let { summit } = SummitObject;

    const PageContent = contentComponent || Content

    return (
      <React.Fragment>
        <MarketingHeroComponent summit={summit} isLoggedUser={isLoggedUser}/>
        {summit && <Countdown summit={summit} />}
        <div className="columns" id="marketing-columns">
          <div className="column is-half px-6 pt-6 pb-0" style={{ position: 'relative' }}>
            {MarketingSite.leftColumn.schedule &&
              <React.Fragment>
                <h2 style={{ fontWeight: 'bold' }}>Full Event Schedule</h2>
                <ScheduleLiteComponent accessToken={loggedUser.accessToken} landscape={true} eventCount={10} />
              </React.Fragment>
            }
            {MarketingSite.leftColumn.disqus &&
              <React.Fragment>
                <h2 style={{ fontWeight: 'bold' }}>Join the conversation</h2>
                <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
              </React.Fragment>
            }
          </div>
          <div className="column is-half px-0 pb-0">
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {MarketingSite.sponsors.map((item, index) => {
                if(item.image) {
                  return (
                    <div key={index}>
                      <img src={item.image} />
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
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
}

const MarketingPage = ({ data, user, loggedUser, isLoggedUser, getTimeNow, getDisqusSSO }) => {
  const { frontmatter, html } = data.markdownRemark

  return (
    <Layout marketing={true}>
      <MarketingPageTemplate
        contentComponent={HTMLContent}
        content={html}
        user={user}
        loggedUser={loggedUser}
        isLoggedUser={isLoggedUser}
        getTimeNow={getTimeNow}
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
  user: PropTypes.object,
  loggedUser: PropTypes.object,
  isLoggedUser: PropTypes.bool,
  getSummitData: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = ({ userState, loggedUserState }) => ({
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

