import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Redirect } from '@reach/router'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import LobbyHeroMarketing from '../components/LobbyHeroMarketing'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent"
import DisqusComponent from '../components/DisqusComponent'
import Content, { HTMLContent } from '../components/Content'
import envVariables from '../utils/envVariables';

import MarketingSite from '../content/marketing-site.json'

import { getSummitData } from '../actions/summit-actions'
import { getDisqusSSO } from '../actions/user-actions'

export const MarketingPageTemplate = class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getSummitData();
  }

  render() {
    let { content, contentComponent, user, summit, isLoggedUser } = this.props;

    const PageContent = contentComponent || Content

    if (isLoggedUser) {
      return <Redirect noThrow to="/a/" />
    } else {
      return (
        <React.Fragment>
          <LobbyHeroMarketing summit={summit} />
          <div className="columns" id="marketing-columns">
            <div className="column is-half px-6 py-6">
              {MarketingSite.leftColumn.schedule &&
                <React.Fragment>
                  <h2 style={{ fontWeight: 'bold' }}>Full Event Schedule</h2>
                  <ScheduleLiteComponent accessToken={false} landscape={true} eventCount={10} />
                </React.Fragment>
              }
              {MarketingSite.leftColumn.disqus &&
                <React.Fragment>
                  <h2 style={{ fontWeight: 'bold' }}>Join the conversation</h2>
                  <DisqusComponent disqusSSO={user?.disqusSSO} summit={envVariables.SUMMIT_ID} style={{ position: 'static' }} />
                </React.Fragment>
              }
            </div>
            <div className="column is-half px-0">
              {MarketingSite.sponsors.length < 6 ?
                <div className="marketing-images">
                  {MarketingSite.sponsors.map((item, index) => {
                    return (
                      <div className={`marketing-img`} key={index}>
                        <img src={item.image} />
                      </div>
                    )
                  })}
                </div> 
                :
                <div className="grid">
                  {MarketingSite.sponsors.map((item, index) => {
                    return (
                      <div className={`grid-item-${index + 1}`} style={{ backgroundImage: `url(${item.image})` }} key={index} />
                    )
                  })}
                </div>
              }
            </div>
          </div>
          <PageContent content={content} />
        </React.Fragment>
      )
    }
  }

}

MarketingPageTemplate.propTypes = {
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  user: PropTypes.object,
  summit: PropTypes.object,
  isLoggedUser: PropTypes.bool,
}

const MarketingPage = ({ data, user, summit, isLoggedUser, getSummitData, getDisqusSSO }) => {
  const { frontmatter, html } = data.markdownRemark

  return (
    <Layout marketing={true}>
      <MarketingPageTemplate
        contentComponent={HTMLContent}
        content={html}
        user={user}
        summit={summit}
        isLoggedUser={isLoggedUser}
        getSummitData={getSummitData}
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
  summit: PropTypes.object,
  isLoggedUser: PropTypes.bool,
  getSummitData: PropTypes.func,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = ({ userState, summitState, loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState,
  summit: summitState.summit,
})

export default connect(mapStateToProps, {
  getSummitData,
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

