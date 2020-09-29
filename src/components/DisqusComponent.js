import React from 'react'
import { DiscussionEmbed } from 'disqus-react';

//import { v5 as uuidv5 } from 'uuid';

import DisqusSettings from '../content/disqus-settings.json';

const DisqusComponent = class extends React.Component {

  constructor(props) {
    super(props)

    this.getIdentifier = this.getIdentifier.bind(this);
    this.getTitle = this.getTitle.bind(this);
  }

  getIdentifier() {
    const { summit, event, page } = this.props;

    let threadsBy = DisqusSettings.disqus_threads_by ? DisqusSettings.disqus_threads_by : DisqusSettings.threads_by;
    let eventExcludes = DisqusSettings.disqus_exclude_events ? DisqusSettings.disqus_exclude_events : [];
    let trackExcludes = DisqusSettings.disqus_exclude_tracks ? DisqusSettings.disqus_exclude_tracks : [];

    let identifier = null;
    if (event && event.id) {
      identifier = eventExcludes.includes(event.id) ? `summit/${summit.id}/event/${event.id}` : null;
    }
    if (event && event.track && event.track.id) {
      identifier = trackExcludes.includes(event.track.id) ? `summit/${summit.id}/track/${event.track.id}` : null;
    }
    if (!event) {
      let path = page ? `/${page}` : '';
      identifier = `summit/${summit.id}${path}`;
    }
    if (identifier === null) {
      switch (threadsBy) {
        case 'summit':
          identifier = `summit/${summit.id}`;
          break;
        case 'event':
          identifier = `summit/${summit.id}/event/${event.id}`;
          break;
        case 'track':
          identifier = event.track?.id ? `summit/${summit.id}/track/${event.track.id}` : `summit/${summit.id}/event/${event.id}`;
          break;
        default:
          identifier = null;
          break;
      }
    }

    //const namespace = 'cd024da4-7762-46ea-96b9-d64a331ed00a';
    //return uuidv5(identifier, namespace);
    return identifier;
  }

  getTitle() {
    const { summit, event, page } = this.props;
    let suffix = '';
    if (event) {
      let threadsBy = DisqusSettings.disqus_threads_by ? DisqusSettings.disqus_threads_by : DisqusSettings.threads_by;
      let trackExcludes = DisqusSettings.disqus_exclude_tracks ? DisqusSettings.disqus_exclude_tracks : [];
      if (event.track && event.track.id && (threadsBy === 'track' || trackExcludes.includes(event.track.id))) {
        suffix += ' - '
        suffix += event.track.name;
      } else if (threadsBy === 'summit') {
      } else {
        suffix += ` - ${event.title}`
      }
    } else if (page) {
      switch (page) {
        case 'lobby':
          suffix += ' - Lobby';
          break;
        case 'marketing-site':
          suffix += ' - Landing Page';
          break;
        default:
          break;
      }
    }
    return `${summit.name}${suffix}`;
  }

  render() {

    const { title, style, className, disqusSSO, page } = this.props;

    let disqusConfig = {
      url: window.location.href,
      identifier: this.getIdentifier(),
      title: this.getTitle(),
      remoteAuthS3: disqusSSO.auth,
      apiKey: disqusSSO.public_key,
    }

    return (
      <div className={className ? className : style ? '' : page === 'marketing-site' ? 'disqus-container-marketing' : 'disqus-container'} style={style}>
        {title && <span className="navbar-brand title" style={{paddingLeft: '0px'}}>{title}</span>}
        <DiscussionEmbed
          shortname='openinfra2020'
          config={disqusConfig}
        />
      </div>
    )
  }

}

export default DisqusComponent