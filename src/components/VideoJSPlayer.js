import React from 'react'
import videojs from 'video.js';
import Youtube from 'videojs-youtube';
import 'videojs-mux';

import 'video.js/dist/video-js.css';

import envVariables from '../utils/envVariables'

class VideoJSPlayer extends React.Component {
  componentDidMount() {

    let plugins = {}

    if (envVariables.MUX_ENV_KEY) {
      plugins = { ...plugins,
        mux: {
          debug: false,
          data: {
            env_key: envVariables.MUX_ENV_KEY,
            /* Metadata
            player_name: '',
            player_init_time: playerInitTime*/
          }
        }
      }
    }

    const options = {
      html5: {
        hls: {
          overrideNative: !videojs.browser.IS_SAFARI,
        },
      },
      plugins: plugins,
      ...this.props,
    };
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sources !== this.props.sources) {
      this.player.src(nextProps.sources);
      this.player.poster(nextProps.poster);
    }
  }
  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-big-play-centered"
            playsInline={this.props.playsInline}
          />
        </div>
      </div>
    );
  }
}

export default VideoJSPlayer;