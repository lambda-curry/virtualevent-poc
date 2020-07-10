import React from "react"
const
  Etherpad = ({ ...props }) => (
    <div className={props.className}>
      <iframe
        width="100%"
        height="420"
        src={props.etherpad_link}
        title='Etherpad'
      />
    </div>
  )
export default Etherpad