import React, { Fragment } from "react";

import { getEnvVariable, OAUTH2_CLIENT_ID, IDP_BASE_URL } from "./envVariables";
import { OPSessionChecker } from "openstack-uicore-foundation/lib/components";

const withSessionChecker = (WrappedComponent) => (props) => {
  const instantiateSessionChecker = () => {
    if (document.getElementById("OPFrame") && document.getElementById("RPCHeckSessionStateFrame")) {
      return null;
    }
    return (
      <OPSessionChecker
        clientId={getEnvVariable(OAUTH2_CLIENT_ID)}
        idpBaseUrl={getEnvVariable(IDP_BASE_URL)}
      />
    );
  };

  return (
    <Fragment>
      {instantiateSessionChecker()}
      <WrappedComponent {...props} />
    </Fragment>
  );
};

export default withSessionChecker;
