import React from "react"

const VideoBanner = ({ event }) => {

  return (
    <div className="join-zoom-container">
      <span>
        Take the virtual mic and participate!
      </span>
      <a className="zoom-link" href={event.meeting_url} target="_blank">
        <button className="zoom-button button">
          <b>Join now</b>
        </button>
      </a>
      <a target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
      </a>
    </div>
  )
}

export default VideoBanner;