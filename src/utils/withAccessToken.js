import React, { useRef, useState } from 'react';

import { useSelector } from 'react-redux'

import { getAccessToken } from 'openstack-uicore-foundation/lib/methods';

const useConstructor = (callback = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
  callback();
  hasBeenCalled.current = true;
}

const withAccessToken = (WrappedComponent) => (props) => {

  const isLoggedUser = useSelector(state => state.loggedUserState.isLoggedUser);

  if (!isLoggedUser) return (<WrappedComponent {...props} />);

  const [accessToken, setAccessToken] = useState(null);

  useConstructor(async() => {
    try {
      const token = await getAccessToken()
      setAccessToken(token)
    } catch (error) {
      console.log(error);
    }
  });
  
  if (accessToken == null) return null;

  return (
    <WrappedComponent accessToken={accessToken} {...props} />
  );
};

export default withAccessToken;