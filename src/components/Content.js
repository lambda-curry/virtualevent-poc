import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cleaner from 'clean-html'

export const HTMLContent = ({ content, className }) => {
  const [cleanHTML, setCleanHTML] = useState(content);
  
  useEffect(() => {
    const options = {
      'remove-empty-tags': ['a', 'p'],
      'indent': '',
      'break-around-tags': []
    }
    cleaner.clean(content, options, cleaned => {
      console.log(cleaned)
      setCleanHTML(cleaned)
    })
  }, [content])
  
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  )
}

const Content = ({ content, className }) => (
  <div className={className}>{content}</div>
)

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
}

HTMLContent.propTypes = Content.propTypes

export default Content
