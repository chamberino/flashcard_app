import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* 
Header- Displays the top menu bar for the application and includes 
buttons for signing in and signing up (if there's not an authenticated user) 
or the user's first and last name and a button for signing out 
(if there's an authenticated user).
*/

export default class Header extends Component {
  // The header nav is conditionally rendered based on the authenticatedUser state

  // componentDidMount() {
  //   window.addEventListener('scroll', () => {
  //     const isTop = window.scrollY > 67;
  //     const nav = document.querySelector('.header')
  //     if (isTop) {
  //       nav.classList.add('scrolled')
  //     } else {
  //       nav.classList.remove('scrolled')
  //     }
  //   })
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', ()=>{})
  // }

  render() {
  return (
    <div className="header"> 
      <div className="bounds">

        <Link to="/profile"><h1 className="header--logo"><strong>Quiz</strong>Wiz™</h1></Link>
        <nav className="nav-items">
            
        {/* Ternary operator checks if authenticatedUser is set in props */}
        {(this.props.context.authenticatedUser)  ? (
            <React.Fragment>
              {/* <span>Welcome, {props.context.authenticatedUser.user.user.name}!</span> */}
              <Link className="header-links" to={`/profile`}>Profile</Link>
              <Link className="header-links" to="/signout">Sign Out</Link>
              <svg className="svg-icon-menu" viewBox="0 0 20 20">
							<path fill="none" d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
								c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
								s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
								c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
						</svg>
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
}





