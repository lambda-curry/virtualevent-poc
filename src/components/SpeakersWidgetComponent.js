import React from "react";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import SpeakersWidget from 'speakers-widget/dist';
import 'speakers-widget/dist/index.css';


const SpeakersWidgetComponent = ({now, colorSettings, allEvents, speakers, ...props}) => {
    const widgetProps = {
        date: now,
        // featured: true,
        speakersData: speakers,
        eventsData: allEvents,
        marketingData: colorSettings,
        ...props
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
            </Helmet>
            <div>
                <SpeakersWidget {...widgetProps} />
            </div>
        </>
    )
}

const mapStateToProps = ({ clockState, allSchedulesState, speakerState, settingState }) => ({
    now: clockState.nowUtc,
    colorSettings: settingState.colorSettings,
    allEvents: allSchedulesState.allEvents,
    speakers: speakerState.speakers
});

export default connect(mapStateToProps, null)(SpeakersWidgetComponent)