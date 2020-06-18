import React from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css'

class LiveVideoPlayer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {

    return (
      <div>
        <div data-vjs-player>
          <video ref={node => this.videoNode = node} className="video-js vjs-big-play-centered"></video>
        </div>
      </div>
    )
  }
}

export default LiveVideoPlayer;