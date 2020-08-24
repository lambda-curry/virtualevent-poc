import React from "react"
import HeroComponent from '../components/HeroComponent'
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
      speakers.forEach((speaker, index) => {
        formatedSpeakers += `${speaker.first_name} ${speaker.last_name}`;
        if (speakers.length > index + 2) formatedSpeakers += ', ';
        if (speakers.length - 2 === index) formatedSpeakers += ' & ';
      });
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

    const { event: { class_name, start_date, end_date, speakers, title, description }, event, summit: { time_zone_id } } = this.props;

    let showHero = class_name !== 'Presentation' || !event.streaming_url
    return (
      <div className={`columns talk ${showHero ? 'px-3 py-3' : 'px-5 py-5'}`}>
        {showHero ?
          <HeroComponent
            title={title}
            subtitle={
              class_name !== 'Presentation' ?
                'Next session will start soon...'
                :
                !event.streaming_url ?
                  `This session will be available on ${epochToMomentTimeZone(start_date, time_zone_id).format('MMMM Do hh:mm A (z)')}`
                  :
                  ''
            }
            event={true}
          />
          :
          <div className="column is-full">
            <span className="talk__date">{this.formatEventDate(start_date, end_date, time_zone_id)} {this.formatEventLocation(event)}</span>
            <h1>
              <b>{title}</b>
            </h1>
            <div className="talk__speaker">
              {speakers && speakers?.length === 0 ?
                null
                :
                speakers?.length < 10 ?
                  <div className="columns is-multiline is-mobile">
                    {speakers.map((s, index) => {
                      return (
                        <div className="column is-one-third-desktop is-half-mobile talk__speaker-container" key={index}>
                          <img src={s.pic} />
                          <div>
                            {`${s.first_name} ${s.last_name}`}
                            <br />
                            <b>{s.title}</b>
                          </div>
                        </div>
                      )
                    })
                    }
                  </div>
                  :
                  <span className="talk__speaker--name">
                    {this.formatSpeakers(speakers)}
                  </span>
              }
              <br />
              <div className="talk__description" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <br />
          </div>
        }
      </div>
    )
  }
}

export default TalkComponent