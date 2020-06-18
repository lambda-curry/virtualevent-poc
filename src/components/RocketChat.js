import React from 'react'
import IframeComm from 'react-iframe-comm';

const RocketChatComponent = class extends React.Component {

  constructor(props) {
    super(props);
    this.state = { auth: '', loggedIn: false, displayChat: false, postMessageData: null };
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getToken();    
  }

  onReady = () => {
    setTimeout(function() { 
      const el = document.getElementById('rocket-chat');
      if (el) {
        el.contentWindow.postMessage({
          externalCommand: 'login-with-token',
          token: this.state.auth
        }, '*');
      }
    }.bind(this), 1000)
  };

  getToken = async () => {
    fetch(`${typeof window === 'object' ? window.IDP_BASE_URL : process.env.GATSBY_IDP_BASE_URL}/api/v1/sso/rocket-chat/fnvirtual-poc/profile?access_token=${this.props.accessToken}`)
      .then(response => response.json())
      .then(json => {
        this.setState({ auth: json.authToken })
      })
      .then(() => {
        this.setState(prevState => {
          let postMessageData = Object.assign({}, prevState.postMessageData);
          postMessageData.externalCommand = 'login-with-token';
          postMessageData.token = this.state.auth;
          return { postMessageData };
        })
      }).then(() => this.setState({ loggedIn: true }))
  }

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