import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Redirect } from '@reach/router'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import Content, { HTMLContent } from '../components/Content'

export const CustomPageTemplate = ({
  title,
  content,
  contentComponent
}) => {
  const PageContent = contentComponent || Content

  return (
    <div className="content">
      <h2>{title}</h2>
      <PageContent content={content} />
    </div>
  )
}

CustomPageTemplate.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const CustomPage = ({ data, isLoggedUser }) => {
  const { frontmatter, html } = data.markdownRemark

  if (frontmatter.requiresAuth && !isLoggedUser) {
    return <Redirect to='/' noThrow />
  }

  return (
    <Layout>
      <CustomPageTemplate
        contentComponent={HTMLContent}
        title={frontmatter.title}
        content={html}
      />
    </Layout>
  )
}

CustomPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
  isLoggedUser: PropTypes.bool,
}

const mapStateToProps = ({ loggedUserState }) => ({  
  isLoggedUser: loggedUserState.isLoggedUser,
})

export default connect(mapStateToProps, null)(CustomPage)

export const customPageQuery = graphql`
  query CustomPageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
        requiresAuth
      }
    }
  }
`

