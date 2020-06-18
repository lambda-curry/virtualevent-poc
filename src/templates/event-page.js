import React from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import { createBrowserHistory } from 'history'
import Content, { HTMLContent } from '../components/Content'

import DisqusComponent from '../components/DisqusComponent'
import Etherpad from '../components/Etherpad'
import RocketChatComponent from '../components/RocketChat'
import VideoComponent from '../components/VideoComponent'
import TalkComponent from '../components/TalkComponent'

import { getEventBySlug } from '../state/event-actions'

import Loadable from "@loadable/component"

const ScheduleClientSide = Loadable(() => import('../components/ScheduleComponent'))
const ScheduleLiteClientSide = Loadable(() => import('../components/ScheduleLiteComponent'))

export const EventPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.onEventChange = this.onEventChange.bind(this);
  }

  componentWillMount() {
    const { loggedUser, eventId } = this.props;
    if (!loggedUser.isLoggedUser) {
      navigate('/a/login');
    } else {
      this.props.getEventBySlug(eventId ? eventId : '99');
    }
  }

  onEventChange(ev) {
    const history = createBrowserHistory()
    history.push(`/a/event/${ev}`);
    this.props.getEventBySlug(ev);
  }

  render() {

    const { loggedUser, event, summit } = this.props;

    if (event) {
      return (
        <section className="section section--gradient">
          <div className="video-row">
            <div className="video-player">
              {event.streaming_url ?
                <VideoComponent url={event.streaming_url} />
                :
                <TalkComponent event={event} summit={summit} noStream={true} />
              }
            </div>
            <div className="disqus-container">
              <DisqusComponent accessToken={loggedUser.accessToken} event={event} />
            </div>
          </div>
          <div className="talk">
            {event.streaming_url ? <TalkComponent event={event} summit={summit} noStream={false} /> : null}
            <div className="talk__row">
              <div className="talk__row--left">
                {event.etherpad_link && <Etherpad className="talk__etherpad" etherpad_link={event.etherpad_link} />}
              </div>
              <div className="talk__row--right">
                {/* <div className="talk__docs">
                  <div className="talk__docs--title">Documents</div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="schedule">
            <div className="schedule__row">
              <div className="schedule__row--left">
                <div className="rocket-container">
                  <ScheduleLiteClientSide accessToken={loggedUser.accessToken} eventClick={(ev) => this.onEventChange(ev)} />
                  {/* <RocketChatComponent accessToken={loggedUser.accessToken} embedded={false} /> */}
                </div>
              </div>
              <div className="schedule__row--right">
                <div className="sponsor-container">
                  <img src="/img/intel.png" alt="sponsor" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    } else {
      return (
        <div className="schedule">
          <div className="schedule__row">
            <div className="schedule__row--left">
              <div className="rocket-container">
                <span>Event not found</span>
                <ScheduleLiteClientSide accessToken={loggedUser.accessToken} eventClick={(ev) => this.onEventChange(ev)} />
              </div>
            </div>
            <div className="schedule__row--right">
              <div className="sponsor-container">
                <img src="/img/intel.png" alt="sponsor" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

EventPageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  // event: PropTypes.object,
  eventId: PropTypes.string,
  getEventBySlug: PropTypes.func,
}

const EventPage = ({ data, loggedUser, summit, event, eventId, location, getEventBySlug }) => {

  if (data) {
    const { event } = data
    return (
      <Layout>
        <EventPageTemplate
          loggedUser={loggedUser}
          event={event}
          summit={summit}
          eventId={eventId}
          location={location}
          getEventBySlug={getEventBySlug}
        />
      </Layout>
    )
  } else {
    return (
      <Layout>
        <EventPageTemplate
          loggedUser={loggedUser}
          event={event}
          summit={summit}
          eventId={eventId}
          location={location}
          getEventBySlug={getEventBySlug}
        />
      </Layout>
    )
  }
}

EventPage.propTypes = {
  data: PropTypes.object,
  loggedUser: PropTypes.object,
  location: PropTypes.object,
  event: PropTypes.object,
  summit: PropTypes.object,
  eventId: PropTypes.string,
  getEventBySlug: PropTypes.func
}

// export const eventPageQuery = graphql`
//   query EventPage($id: String!) {
//     event(id: { eq: $id }) {
//       title
//       description
//       attending_media      
//       end_date
//       etherpad_link
//       meeting_url
//       start_date
//       streaming_url
//       timezone
//     }
//   }
// `

const mapStateToProps = ({ loggedUserState, eventState, summitState }) => ({
  loggedUser: loggedUserState,
  event: eventState.event,
  summit: summitState.summit
})

export default connect(
  mapStateToProps,
  {
    getEventBySlug
  }
)(EventPage);
