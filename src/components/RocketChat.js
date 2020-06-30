import React from 'react'
import IframeComm from 'react-iframe-comm';

const RocketChatComponent = class extends React.Component {

  constructor(props) {
    super(props);
    this.state = { displayChat: false, postMessageData: null };
  }

  componentDidMount() {
    const { rocketChatSSO: { authToken } } = this.props;

    this.setState(prevState => {
      let postMessageData = Object.assign({}, prevState.postMessageData);
      postMessageData.externalCommand = 'login-with-token';
      postMessageData.token = authToken
      return { postMessageData };
    });
  }

  onReady = () => {
    const { rocketChatSSO: { authToken } } = this.props;

    setTimeout(function () {
      const el = document.getElementById('rocket-chat');
      if (el) {
        el.contentWindow.postMessage({
          externalCommand: 'login-with-token',
          token: authToken
        }, '*');
      }
    }.bind(this), 1000)

  };

  render() {

    let { displayChat, postMessageData } = this.state;
    const { embedded } = this.props;

    let iframeConfig = {
      id: 'rocket-chat',
      src: 'https://rocket-chat.dev.fnopen.com/channel/general',
      width: embedded ? '400px' : '100%',
      height: '600px',
      style: { display: !embedded || displayChat ? '' : 'none' },
      className: embedded ? 'rocket-chat--embedded' : 'rocket-chat--full'
    }

    if (!postMessageData) {
      return null
    } else {
      if (embedded) {
        return (
          <div className="rocket-chat">
            <div className="rocket-chat--button" onClick={() => this.setState({ displayChat: !displayChat })}>
              <img src={displayChat ? '/img/close.svg' : '/img/chat.svg'} width="30px" />
            </div>
            <IframeComm
              attributes={iframeConfig}
              handleReady={this.onReady}
            />
          </div>
        )
      } else {
        return (
          <div className="rocket-chat">
            <IframeComm
              attributes={iframeConfig}
              handleReady={this.onReady}
            />
          </div>
        )
      }
    }
  }
}

export default RocketChatComponent