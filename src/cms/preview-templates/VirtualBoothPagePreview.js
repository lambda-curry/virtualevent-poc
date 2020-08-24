import React from 'react'
import PropTypes from 'prop-types'
import { VirtualBoothPageTemplate } from '../../templates/virtual-booth-page'

const VirtualBoothPagePreview = ({ entry, getAsset, widgetFor }) => {
  return (
    <VirtualBoothPageTemplate
      title={entry.getIn(['data', 'title'])}
      intro={entry.getIn(['data', 'intro'])}
      columns={entry.getIn(['data', 'columns'])}
      endText={entry.getIn(['data', 'endText'])}
      content={widgetFor('body')}
    />
  )
}

VirtualBoothPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default VirtualBoothPagePreview
