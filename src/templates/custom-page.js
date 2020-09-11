import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import OCPHeroComponent from '../components/OCPHeroComponent'
import Content, { HTMLContent } from '../components/Content'
import SummitObject from '../content/summit.json'

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

const CustomPage = ({ data, location, summit_phase, isLoggedUser }) => {
  const { frontmatter, html } = data.markdownRemark
  let { summit } = SummitObject;

  return (
    <Layout marketing={true}>
      <OCPHeroComponent
        summit={summit}
        summit_phase={summit_phase}
        isLoggedUser={isLoggedUser}
        location={location}
      />
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
  summit_phase: PropTypes.number,
  isLoggedUser: PropTypes.bool,
}

const mapStateToProps = ({ summitState, loggedUserState }) => ({
  summit_phase: summitState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
})

export default connect(mapStateToProps, null)(CustomPage)

export const customPageQuery = graphql`
  query CustomPageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
      }
    }
  }
`

