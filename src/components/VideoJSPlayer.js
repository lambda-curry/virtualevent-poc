import React from 'react'
import videojs from 'video.js';
import Youtube from 'videojs-youtube';

import 'video.js/dist/video-js.css';

class VideoJSPlayer extends React.Component {
  componentDidMount() {

    const options = {
      html5: {
        hls: {
          overrideNative: !videojs.browser.IS_SAFARI,
        },
      },
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