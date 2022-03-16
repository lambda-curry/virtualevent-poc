import React from 'react';
import { connect } from 'react-redux';
import { DiscussionEmbed } from 'disqus-react';
import { getEnvVariable, DISQUS_SHORTNAME } from '../utils/envVariables';

const DisqusComponent = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isMobile: false
    };

    this.getIdentifier = this.getIdentifier.bind(this);
    this.getTitle = this.getTitle.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    if (window.innerWidth <= 768) {
      this.setState({ isMobile: true })
    } else {
      this.setState({ isMobile: false })
    }
  }

  onResize = () => {
    if (window.innerWidth <= 768 && this.state.isMobile === false) {
      this.setState({ isMobile: true })
    }
    if (window.innerWidth > 768 && this.state.isMobile === true) {
      this.setState({ isMobile: false })
    }
  };

  getIdentifier() {
    const { summit, page, sponsor, event, disqusSettings } = this.props;

    let threadsBy = disqusSettings.disqus_threads_by ? disqusSettings.disqus_threads_by : disqusSettings.threads_by;

    let identifier = null;

    if (event) {
      let eventExcludes = disqusSettings.disqus_exclude_events ? disqusSettings.disqus_exclude_events : [];
      let trackExcludes = disqusSettings.disqus_exclude_tracks ? disqusSettings.disqus_exclude_tracks : [];

      identifier = eventExcludes.includes(event.id) ? `summit/${summit.id}/event/${event.id}` : null;

      if (event.track && event.track.id) {
        identifier = trackExcludes.includes(event.track.id) ? `summit/${summit.id}/track/${event.track.id}` : null;
      }

      if (identifier === null) {
        switch (threadsBy) {
          case 'event':
            identifier = `summit/${summit.id}/event/${event.id}`;
            break;
          case 'track':
            identifier = event.track?.id ? `summit/${summit.id}/track/${event.track.id}` : `summit/${summit.id}/event/${event.id}`;
            break;
          case 'summit':
            identifier = `summit/${summit.id}`;
            break;
          default:
            identifier = null;
            break;
        }
      }
    } else if (sponsor) {
      identifier = `summit/${summit.id}/sponsor/${sponsor.id}`;
    }

    if (page) {
      identifier = threadsBy === 'summit' ? `summit/${summit.id}` : `summit/${summit.id}/${page}`;
    }

    return identifier;
  }

  getTitle() {
    const { summit, page, sponsor, event, disqusSettings } = this.props;
    let suffix = '';
    const threadsBy = disqusSettings.disqus_threads_by ? disqusSettings.disqus_threads_by : disqusSettings.threads_by;
    if (event) {
      const trackExcludes = disqusSettings.disqus_exclude_tracks ? disqusSettings.disqus_exclude_tracks : [];
      if (event.track && event.track.id && (threadsBy === 'track' || trackExcludes.includes(event.track.id))) {
        suffix += ' - ';
        suffix += event.track.name;
      } else if (threadsBy === 'summit') {
      } else {
        suffix += ` - ${event.title}`
      }
    } else if (sponsor) {
      suffix += ` - Sponsor - ${sponsor.name}`
    } else if (page && threadsBy !== 'summit') {
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

    const { title, style, className, disqusSSO, page, hideMobile = null } = this.props;
    const { isMobile } = this.state || null;

    let disqusConfig = {
      url: window.location.href,
      identifier: this.getIdentifier(),
      title: this.getTitle(),
      remoteAuthS3: disqusSSO.auth,
      apiKey: disqusSSO.public_key
    };

    if (hideMobile !== null && hideMobile === isMobile) {
      return null;
    }

    return (
      <div className={className ? className : style ? '' : page === 'marketing-site' ? 'disqus-container-marketing' : 'disqus-container'} style={style}>
        {title && <span className="navbar-brand title" style={{ paddingLeft: className !== 'disqus-container-home' ? '0px' : ''}}>{title}</span>}
        <DiscussionEmbed
          shortname={getEnvVariable(DISQUS_SHORTNAME)}
          config={disqusConfig}
        />
      </div>
    )
  }

};

const mapStateToProps = ({settingState, summitState}) => ({
  disqusSettings: settingState.disqusSettings,
  summit: summitState.summit
});

export default connect(mapStateToProps, {})(DisqusComponent)
