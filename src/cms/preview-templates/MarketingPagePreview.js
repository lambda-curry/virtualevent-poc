import React from 'react'
import PropTypes from 'prop-types'
import { MarketingPageTemplate } from '../../templates/marketing-page'

const MarketingPagePreview = ({ entry, getAsset, widgetFor }) => {
  return (
    <MarketingPageTemplate
      content={widgetFor('body')}
    />
  )
}

MarketingPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default MarketingPagePreview
