import React from "react"

const PublicRoute = ({ component: Component, location, ...rest }) => {
  return <Component location={location} {...rest} />;
}

export default PublicRoute