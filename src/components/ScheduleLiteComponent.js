import React, { Component } from "react"
import { Helmet } from 'react-helmet'
import { navigate } from "gatsby";

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite/dist';
import 'schedule-lite/dist/index.css';

const ScheduleComponent = class extends React.Component {

  expiredToken(err) {
    
    let currentLocation = window.location.pathname;

    return navigate('/a/expired', {
      state: {
        backUrl: currentLocation,
      },
    });
  }

  render() {

    const { accessToken } = this.props;

    const scheduleProps = {
      apiBaseUrl: `${typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}`,
      marketingApiBaseUrl: `${typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL}`,
      accessToken: accessToken,
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: parseInt(typeof window === 'object' ? window.SUMMIT_ID : process.env.GATSBY_GATSBY_SUMMIT_ID),
      landscape: true,
      updateCallback: ev => console.log('event updated', ev),
      onEventClick: ev => this.props.eventClick(ev),
      onAuthError: (err, res) => this.expiredToken(err)
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <ScheduleLite {...scheduleProps} />
        </div>
      </React.Fragment>
    )
  }
}

export default ScheduleComponent