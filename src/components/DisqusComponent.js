import React from 'react'
//import { Disqus } from 'gatsby-plugin-disqus'
import { DiscussionEmbed } from 'disqus-react';

const DisqusComponent = class extends React.Component {

  constructor(props) {
    super(props);    
  }

  render() {

    const { event, disqusSSO } = this.props;

    let disqusConfig = {
      url: window.location.href,
      identifier: `${event.id}`,
      title: event.title,
      remoteAuthS3: disqusSSO.auth,
      apiKey: disqusSSO.public_key,
    }

    if (!disqusConfig.remoteAuthS3 && !disqusConfig.apiKey) {
      return null;
    } else {
      return (
        <div className="disqus-container">
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