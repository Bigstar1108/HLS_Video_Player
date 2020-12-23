import React, { PropTypes } from 'react';
import Hls from 'hls.js';

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMuted: true,
            isPlaying: false,
            playerId: Date.now(),
            currentTime: '',
        };

        this.hls = null;
        this.playVideo = this.playVideo.bind(this);
    }

    componentDidMount() {
        this._initPlayer();
    }

    setCurrentTime = (time) => {
        console.log('time', time);
        this.setState({
            currentTime: time,
        });
    };

    componentDidUpdate() {
        // this._initPlayer();
    }

    componentWillUnmount() {
        if (this.hls) {
            this.hls.destroy();
        }
        clearInterval(this.interval);
    }

    playVideo() {
        let { video: $video } = this.refs;
        $video.play();

        this.setState({ isPlaying: true });
    }

    _initPlayer() {
        if (this.hls) {
            this.hls.destroy();
        }

        let autoplay = true;
        let url = 'http://192.168.1.74:7777/SKI3/2020-12-22/01:44:17/output.m3u8';
        let hlsConfig = { debug: true, enableWorker: true, liveBackBufferLength: 900 };
        let { video: $video } = this.refs;
        let hls = new Hls(hlsConfig);

        hls.attachMedia($video);

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(url);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('start');
                this.interval = setInterval(() => {
                    var _currentTime = parseFloat($video.currentTime).toFixed(0);
                    this.setState({
                        currentTime: _currentTime,
                    });
                    console.log(_currentTime);
                }, 1000);
                if (autoplay) {
                    const videoItem = $video;
                    videoItem.play();
                } else {
                    $video.pause();
                }
            });
        });

        this.hls = hls;
    }

    render() {
        const { isMuted, isPlaying, playerId } = this.state;
        const { controls = true, width, height } = this.props;

        return (
            <div key={playerId}>
                {!isPlaying && <span onClick={this.playVideo}></span>}
                <video ref="video" id={`react-hls-${playerId}`} controls={controls} width="100%" height="auto" muted={isMuted} playsinline></video>
                <span>live time: {this.state.currentTime}</span>
            </div>
        );
    }
}

export default VideoPlayer;
