import React, { Component } from "react"
import { Helmet } from 'react-helmet'

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite/dist';
import 'schedule-lite/dist/index.css';

const ScheduleComponent = class extends React.Component {

  render() {

    const { accessToken } = this.props;

    const scheduleProps = {
      apiBaseUrl: `${typeof window === 'object' ? window.EVENT_API_BASE_URL : process.env.GATSBY_EVENT_API_BASE_URL}`,
      accessToken: accessToken,
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: typeof window === 'object' ? window.EVENT_SUMMIT_ID : process.env.GATSBY_GATSBY_EVENT_SUMMIT_ID,
      landscape: true,
      updateCallback: ev => console.log('event updated', ev),
      onEventClick: ev => this.props.eventClick(ev)
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={{ padding: "0 15px" }}>
          <ScheduleLite {...scheduleProps} />
        </div>
      </React.Fragment>
    )
  }
}

export default ScheduleComponent