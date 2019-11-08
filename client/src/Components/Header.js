import React from 'react';
import { Link } from 'react-router-dom';

/* 
Header- Displays the top menu bar for the application and includes 
buttons for signing in and signing up (if there's not an authenticated user) 
or the user's first and last name and a button for signing out 
(if there's an authenticated user).
*/

export default (props) => {
  // The header nav is conditionally rendered based on the authenticatedUser state
  return (
    <div className="header">
      <div className="bounds">

        <Link to="/decks"><h1 className="header--logo"><strong>Quiz</strong>Wiz™</h1></Link>
        <nav>
            
        {/* Ternary operator checks if authenticatedUser is set in props */}
        {(props.context.authenticatedUser)  ? (
            <React.Fragment>
              {/* <span>Welcome, {props.context.authenticatedUser.user.user.name}!</span> */}
              <Link className="header-links" to={`/profile`}>Profile</Link>
              <Link className="header-links" to="/signout">Sign Out</Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link className="header-links" to={"/signin"}>Log In</Link>
              <Link className="header-links-2" to={"/signup"}>Sign Up</Link>
            </React.Fragment>
          )}

        </nav>
      </div>
    </div>
  );
}

