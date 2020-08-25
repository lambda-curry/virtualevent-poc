import React from 'react'
import PropTypes from 'prop-types'
import { VirtualBoothPageTemplate } from '../../templates/virtual-booth-page'

const VirtualBoothPagePreview = ({ entry, getAsset, widgetFor }) => {

  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
      <VirtualBoothPageTemplate
        title={entry.getIn(['data', 'title'])}
        intro={entry.getIn(['data', 'intro'])}
        columns={{
          leftColumn: {
            title: entry.getIn(['data', 'columns', 'leftColumn', 'title']),
            content: entry.getIn(['data', 'columns', 'leftColumn', 'content']),
            image: entry.getIn(['data', 'columns', 'leftColumn', 'image'])
          },
          rightColumn: {
            title: entry.getIn(['data', 'columns', 'rightColumn', 'title']),
            content: entry.getIn(['data', 'columns', 'rightColumn', 'content']),
            image: entry.getIn(['data', 'columns', 'rightColumn', 'image'])
          }
        }}
        endText={entry.getIn(['data', 'endText'])}
        content={widgetFor('body')}
      />
    )
  } else {
    return <div>Loading...</div>
  }

}

VirtualBoothPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default VirtualBoothPagePreview
