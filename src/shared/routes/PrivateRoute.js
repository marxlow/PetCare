import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isLoggedIn from 'utils/isLoggedIn';

// Redirects back to "/login" if user is not logged in
const PrivateRoute = ({ component, ...rest }) => {
  if (isLoggedIn()) {
    return (
      <Route {...rest} component={component} />
    )
  }
  return (
    <Redirect to="/login" />
  );
}

export default PrivateRoute;