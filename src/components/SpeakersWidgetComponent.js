import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

import SpeakersWidget from 'speakers-widget';
import 'speakers-widget/index.css';

import EventsData from '../content/events.json'
import SpeakersData from '../content/speakers.json'
import MarketingData from '../content/colors.json'

const SpeakersWidgetComponent = class extends React.Component {

  render() {

    const { now, ...props } = this.props;

    const widgetProps = {
      date: now,
      // featured: true,
      speakersData: SpeakersData,
      eventsData: EventsData,
      marketingData: MarketingData.colors,
      ...props
    };

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div>
          <SpeakersWidget {...widgetProps} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ clockState }) => ({
  now: clockState.nowUtc
})

export default connect(mapStateToProps, null)(SpeakersWidgetComponent)