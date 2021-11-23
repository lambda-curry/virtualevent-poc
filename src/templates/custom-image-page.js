import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Redirect } from '@reach/router'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import Content, { HTMLContent } from '../components/Content'

export const CustomImagePageTemplate = ({
  title,
  desktopImagePage,
  mobileImagePage,
  content,
  contentComponent
}) => {
  const PageContent = contentComponent || Content

  return (
    <div className="content">
      <h2>{title}</h2>
      <div>
        <img className="image-page" src={!!desktopImagePage?.childImageSharp ? desktopImagePage?.childImageSharp.fluid.src : desktopImagePage} alt="" />
        <img className="mobile-image-page" src={!!mobileImagePage?.childImageSharp ? mobileImagePage?.childImageSharp.fluid.src : mobileImagePage} alt="" />
      </div>
      <PageContent content={content} />
    </div>
  )
}

CustomImagePageTemplate.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  desktopImagePage: PropTypes.object,
  mobileImagePage: PropTypes.object,
  contentComponent: PropTypes.func,
}

const CustomImagePage = ({ data, isLoggedUser, hasTicket, isAuthorized }) => {
  const { frontmatter: { title, userRequirement, desktopImagePage, mobileImagePage }, html } = data.markdownRemark
  // if isAuthorized byoass the AUTHZ check
  if (
    !isAuthorized &&
    (
      (userRequirement === 'LOGGGED_IN' && !isLoggedUser) || (userRequirement === 'HAS_TICKET' && !hasTicket)
    )) {
    return <Redirect to='/' noThrow />
  }

  return (
    <Layout>
      <CustomImagePageTemplate
        contentComponent={HTMLContent}
        title={title}
        desktopImagePage={desktopImagePage}
        mobileImagePage={mobileImagePage}
        content={html}
      />
    </Layout>
  )
}

CustomImagePage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
  isLoggedUser: PropTypes.bool,
  hasTicket: PropTypes.bool,
};

const mapStateToProps = ({ loggedUserState, userState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  hasTicket: userState.hasTicket,
  isAuthorized: userState.isAuthorized,
});

export default connect(mapStateToProps, null)(CustomImagePage)

export const customImagePageQuery = graphql`
  query CustomImagePageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
        desktopImagePage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }        
        mobileImagePage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`

