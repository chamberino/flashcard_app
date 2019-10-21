import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Components/Context';

export default ({ component: Component, ...rest }) => {
    return (
        <Consumer>
        {(context) => (
          <Route
            {...rest}
            render={props => (context.authenticatedUser) ? (
                <Component {...props} />
              ) : (
                // The React Redirect Component provides a simple way to  
                // redirect users to the last page upon signin by passing an
                //  object instead of a string as the value of the "to" prop 
                // The object contains information about the path to redirect
                // to (if not authenticated), and the route the user was trying to 
                // access before being redirected
                <Redirect to={{
                    pathname: '/signin',
                    state: { from: props.location },
                }} />
              )
            }
          />
      )}
      </Consumer>
    );
};

