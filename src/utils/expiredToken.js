import { navigate } from "gatsby";

const expiredToken = function (err) {
    
  let currentLocation = window.location.pathname;

  return navigate('/auth/expired', {
    state: {
      backUrl: currentLocation,
    },
  });
}

export default expiredToken