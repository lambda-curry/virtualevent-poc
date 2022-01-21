import React from 'react'
import PropTypes from 'prop-types'

const CMSImage = ({ file, alt }) => (
    <img src={file} alt={alt} />
)

CMSImage.propTypes = {
  file: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
}

export default CMSImage
