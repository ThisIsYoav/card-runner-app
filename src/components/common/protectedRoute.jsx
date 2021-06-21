import React from "react";
import { Route, Redirect } from "react-router-dom";
import userService from "../../services/userService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const currentUser = userService.getCurrentUser();
  return (
    <Route
      {...rest}
      render={props => {
        // if not logged in or not a business when necessary, redirect
        if (!currentUser || (rest.biz && !currentUser.biz))
          return (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...rest} {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;