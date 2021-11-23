import React from 'react'
import PropTypes from 'prop-types'
import { CustomPageTemplate } from '../../templates/custom-page'
import { CustomImagePageTemplate } from '../../templates/custom-image-page'

const CustomPagePreview = ({ entry, getAsset, widgetFor }) => {

  const data = entry.getIn(['data']).toJS()  

  if (data) {    
    if (data.templateKey === 'custom-page') {
      return (
        <CustomPageTemplate
          title={entry.getIn(['data', 'title'])}
          content={widgetFor('body')}
        />
      )
    } else {
      return (
        <CustomImagePageTemplate
          title={entry.getIn(['data', 'title'])}
          desktopImagePage={entry.getIn(['data', 'desktopImagePage'])}
          mobileImagePage={entry.getIn(['data', 'mobileImagePage'])}
          content={widgetFor('body')}
        />
      )
    }
  } else {
    return <div>Loading...</div>
  }
}

CustomPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
}

export default CustomPagePreview
