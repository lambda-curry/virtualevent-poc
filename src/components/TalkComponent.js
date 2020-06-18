import React, { Component } from "react"
import { Link } from 'gatsby'

import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

const TalkComponent = class extends React.Component {

  constructor(props) {
    super(props);

    this.formatEventDate = this.formatEventDate.bind(this);
    this.formatSpeakers = this.formatSpeakers.bind(this);
    this.formatEventLocation = this.formatEventLocation.bind(this);
  }

  formatEventDate(start_date, end_date, timezone) {
    if (!start_date || !end_date || !timezone) return;
    const date = epochToMomentTimeZone(start_date, timezone).format('dddd, MMMM D')
    const startTime = epochToMomentTimeZone(start_date, timezone).format('h:mm a');
    const endTime = epochToMomentTimeZone(end_date, timezone).format('h:mm a');
    const dateNice = `${date}, ${startTime} - ${endTime}`;
    return dateNice;
  }

  formatSpeakers(speakers) {
    let formatedSpeakers = '';
    if (speakers && speakers.length > 0) {
      speakers.map((speaker, index) => {
        formatedSpeakers += `${speaker.first_name} ${speaker.last_name}`;
        if (speakers.length > index + 2) formatedSpeakers += ', ';
        if (speakers.length - 2 === index) formatedSpeakers += ' & ';
      })
    }
    return formatedSpeakers;
  }

  formatEventLocation(event) {
    let formattedLocation = `
      ${event?.location?.venue?.name ? `- ${event.location.venue.name}` : ''} 
      ${event?.location?.floor?.name ? ` - ${event.location.floor.name}` : ''}
      ${event?.location?.name ? ` - ${event.location.name}` : ''}`;
    return event === {} ? 'Select an event from the schedule' : formattedLocation;
  }

  render() {

    const { event: { start_date, end_date, speakers, title, description }, event, noStream, summit: { time_zone_id } } = this.props;

    return (
      <div className="talk__row" style={noStream ? { padding: '20px 40px' } : null}>
        <div className="talk__row--left">
          <span className="talk__date">{this.formatEventDate(start_date, end_date, time_zone_id)} {this.formatEventLocation(event)}</span>
          <h1>
            <b>{title}</b>
          </h1>
          <div className="talk__speaker">
            <img />
            <span className="talk__speaker--name">{this.formatSpeakers(speakers)}</span>
            <br /><br />
            <div className="talk__description" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
        {event.meeting_url &&
          <div className="talk__row--right">
            <div className="talk__"></div>
            <div className="talk__join-button">
              <a href={event.meeting_url} target="_blank">
                join zoom to take the mic !
              </a>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default TalkComponent