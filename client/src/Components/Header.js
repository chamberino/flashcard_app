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

        <Link to="/decks"><h1 className="header--logo">Flashcards App</h1></Link>
        <nav>
            
        {/* Ternary operator checks if authenticatedUser is set in props */}
        {(props.context.authenticatedUser)  ? (
            <React.Fragment>
              <span>Welcome, {props.context.authenticatedUser.user.user.name}!</span>
              <Link to={`/user/${props.context.authenticatedUser.user.user.id}`}>Profile</Link>
              <Link to="/signout">Sign Out</Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link className="signup" to={"/signup"}>Sign Up</Link>
              <Link className="signin" to={"/signin"}>Sign In</Link>
            </React.Fragment>
          )}

        </nav>
      </div>
    </div>
  );
}

