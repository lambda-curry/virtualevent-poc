import React, { Component } from "react"
import { Helmet } from 'react-helmet'

// these two libraries are client-side only
import 'summit-schedule-app'
import 'summit-schedule-app/dist/main.css'

const ScheduleComponent = class extends React.Component {
  // custom component using client-side libraries
  render() {

    const { base, accessToken } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div style={{ padding: "0 15px" }}>
          <summit-schedule
            summit_id="16"
            api_access_token=""
            api_url={typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL}
            schedule_base={typeof window === 'object' ? window.location.pathname : `/${base}`}
            schedule_url={typeof window === 'object' ? window.location.origin : `localhost/${base}`}
            login_url="login-url-not-set"
            calendar_instructions_link="calendar-instructions-link-not-set"
            venues_page_link="venues-page-not-set"
          />
        </div>
      </React.Fragment>
    )
  }
}

export default ScheduleComponent