import React from 'react'
//import { Disqus } from 'gatsby-plugin-disqus'
import { DiscussionEmbed } from 'disqus-react';

const DisqusComponent = class extends React.Component {

  constructor(props) {
    super(props);
    this.state = { auth: '', public_key: '' };
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    fetch(`${typeof window === 'object' ? window.IDP_BASE_URL : process.env.GATSBY_IDP_BASE_URL}/api/v1/sso/disqus/fnvirtual-poc/profile?access_token=${this.props.accessToken}`)
      .then(response => response.json())
      .then(json => {
        this.setState({ auth: json.auth, public_key: json.public_key })
      })
  }

  render() {

    const { event } = this.props;

    let disqusConfig = {
      url: window.location.href,
      identifier: `${event.id}`,
      title: event.title,
      remoteAuthS3: this.state.auth,
      apiKey: this.state.public_key,
    }

    if (!disqusConfig.remoteAuthS3 && !disqusConfig.apiKey) {
      return null;
    } else {
      return (
        <div className="disqus" style={{ paddingLeft: "20px" }}>
          <h3>Join the conversation</h3>
          <DiscussionEmbed
            shortname='fnvirtual-poc'
            config={disqusConfig}
          />
        </div>
      )
    }
  }

}

export default DisqusComponent