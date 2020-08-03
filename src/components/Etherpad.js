import React from "react"
const
  Etherpad = ({ ...props }) => {
    let cleanUrl = props.etherpad_link.includes('?') ? props.etherpad_link.split('?')[0] : props.etherpad_link;    
    let etherpadSettings = `?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false&userName=${props.userName}`;
    return (
      <div className={props.className}>
        <iframe
          width="100%"
          height="420"
          src={`${cleanUrl}${etherpadSettings}`}
          title='Etherpad'
        />
      </div>
    )
  }
export default Etherpad