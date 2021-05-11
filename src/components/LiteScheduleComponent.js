import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";
import axios from 'axios'

// these two libraries are client-side only
import LiteSchedule from 'lite-schedule-widget/dist';
import 'lite-schedule-widget/dist/index.css';

import withAccessToken from "../utils/withAccessToken";

import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

import HomeSettings from '../content/home-settings.json'
import EventsData from '../content/events.json'
import SummitData from '../content/summit.json'
import MarketingData from '../content/colors.json'

import { addToSchedule, removeFromSchedule } from '../actions/user-actions';

const LiteScheduleComponent = ({ className, userProfile, accessToken, page }) => {
    const wrapperClass = page === 'marketing-site' ? 'schedule-container-marketing' : 'schedule-container';

    const componentProps = {
      defaultImage: HomeSettings.schedule_default_image,
      eventsData: EventsData,
      summitData: SummitData.summit,
      marketingData: MarketingData.colors,
      userProfile: userProfile,
      triggerAction: (action, {event}) => {
        const url = `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/members/me/schedule/${event.id}`;
        switch (action) {
          case 'ADDED_TO_SCHEDULE': {
            const request = axios.post(
              url, { access_token: accessToken }
            ).then(() => {
              this.props.addToSchedule(event);
              return event;
            }).catch(e => {
              console.log('ERROR: ', e)
              return e;
            });
            return request;
          }
          case 'REMOVED_FROM_SCHEDULE': {
            const request = axios.delete(
              url, { data: { access_token: accessToken } }
            ).then(() => {
              this.props.removeFromSchedule(event);
              return event;
            }).catch(e => {
              console.log('ERROR: ', e)
              return e;
            });
            return request;
          }
        }
      }
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div className={className || wrapperClass}>
          <LiteSchedule {...componentProps} {...this.props} />
        </div>
      </React.Fragment>
    )
};

const mapStateToProps = ({ userState }) => ({
  userProfile: userState.userProfile
});

export default connect(mapStateToProps, { addToSchedule, removeFromSchedule })(withAccessToken(LiteScheduleComponent))
