import React, { Fragment } from "react";

import envVariables from "./envVariables";
import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const withSessionChecker = (WrappedComponent) => (props) => {
  const instantiateSessionChecker = () => {
    if (document.getElementById("OPFrame") && document.getElementById("RPCHeckSessionStateFrame")) {
      return null;
    }
    return (
      <OPSessionChecker
        clientId={envVariables.OAUTH2_CLIENT_ID}
        idpBaseUrl={envVariables.IDP_BASE_URL}
      />
    );
  };

  return (
    <Fragment>
      {instantiateSessionChecker()}
      <WrappedComponent {...props} />;
    </Fragment>
  );
};

export default withSessionChecker;
