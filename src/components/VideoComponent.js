import React from 'react'
import VideoJSPlayer from './VideoJSPlayer';
import VimeoPlayer from "./VimeoPlayer";
import styles from '../styles/video.module.scss'

const VideoComponent = class extends React.Component {

    constructor(props) {
        super(props);

        this.checkLiveVideo = this.checkLiveVideo.bind(this);
        this.checkVimeoVideo = this.checkVimeoVideo.bind(this);
    }

    checkLiveVideo(url) {
        let isLiveVideo = null;
        url.match(/.m3u8/) ? isLiveVideo = true : isLiveVideo = false;
        return isLiveVideo;
    }

    checkVimeoVideo(url){
        // this is get from vimeo dash board
        return url.match(/https:\/\/(www\.)?(player\.)?vimeo.com\/(.*)/);
    }

    render() {
        const {url, title, namespace, firstHalf} = this.props;

        if (url) {
            // vimeo player
            if(this.checkVimeoVideo(url)){
                return (
                    <VimeoPlayer
                        video={url}
                        autoplay
                        className={styles.vimeoPlayer}
                    />
                )
            }

            // default mux live
            if (this.checkLiveVideo(url)) {
                const videoJsOptions = {
                    autoplay: true,
                    controls: true,
                    fluid: true,
                    sources: [{
                        src: url,
                        type: 'application/x-mpegURL'
                    }],
                    playsInline: true
                }
                return (
                    <VideoJSPlayer title={title} namespace={namespace} firstHalf={firstHalf} {...videoJsOptions} />
                )
            }

            const videoJsOptions = {
                autoplay: true,
                controls: true,
                fluid: true,
                techOrder: ["youtube"],
                sources: [{
                    type: "video/youtube",
                    src: url
                }],
                youtube: {
                    ytControls: 0,
                    iv_load_policy: 1
                },
                playsInline: true
            }

            return (
                <VideoJSPlayer title={title} namespace={namespace} {...videoJsOptions} />
            )

        }

        return <span className="no-video">No video URL Provided</span>

    }

}

export default VideoComponent
