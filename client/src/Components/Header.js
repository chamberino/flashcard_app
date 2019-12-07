import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withContext from './Context'
import Search from './Search';

import { fadeIn, fadeOut } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const SearchWithContext = withContext(Search);

/* 
Header- Displays the top menu bar for the application and includes 
buttons for signing in and signing up (if there's not an authenticated user) 
or the user's first and last name and a button for signing out 
(if there's an authenticated user).
*/

export default class Header extends Component {
  // The header nav is conditionally rendered based on the authenticatedUser state

  constructor(props) {
    super(props);
      this.state= {
        searchOpen: false,
        fade: {},
        fadeIn: {
          animation: 'x .5s',
          animationName: Radium.keyframes(fadeIn, 'fadeIn')
        },
        fadeOut: {
          animation: 'x .5s',
          animationName: Radium.keyframes(fadeOut, 'fadeOut')
        }    
      }
  }

  componentDidMount() {
    // window.addEventListener('scroll', () => {
    //   const isTop = window.scrollY > 67;
    //   const nav = document.querySelector('.header')
    //   if (isTop) {
    //     nav.classList.add('scrolled')
    //   } else {
    //     nav.classList.remove('scrolled')
    //   }
    // })

  }

  searchClick = () => {
    // this.setState(() => { 
    //   return {
    //     searchOpen: !this.state.searchOpen,
    //   }
    // });
    if (this.state.searchOpen) {
      this.setState(() => { return {fade: this.state.fadeOut}})
    } else {
      this.setState(() => { return {fade: this.state.fadeIn}});
    }

    setTimeout(() => { 
      this.setState(() => { 
        return {
          searchOpen: !this.state.searchOpen,
        }
      });
      }, 150);
    
  }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', ()=>{})
  // }

  // toggleMenu = () => {
  //   const menuButton = document.querySelector('.svg-icon-menu-open');
  //   const menu = document.querySelector('.menu');
  //   menuButton.addEventListener('click', (e) => {
  //       menu.classList.toggle("menu-shown")
  //   })
  // }

  toggleMenu = () => {
    const mainContent = document.querySelector('.main-content');
    // const menuButton = document.querySelector('.svg-icon-menu');
    const menuNavigation = document.querySelector('.menu-navigation');
    // const menu = document.querySelector('.menu');
        mainContent.classList.toggle("main-content-hidden")
        // menu.classList.toggle("menu-shown");
        menuNavigation.classList.toggle("menu-nav-shown");
  }

  render() {
  return (
    <div>
    <header className="header"> 
        {/* <SearchWithContext searchOpen={this.state.searchOpen} searchClick={this.searchClick}/> */}

      {
        (this.state.searchOpen)
      ? <div className="bounds">
            <nav className="nav-items">

            <StyleRoot><div style={this.state.fade}><SearchWithContext searchOpen={this.state.searchOpen} searchClick={this.searchClick}/></div></StyleRoot>
                
            {/* Ternary operator checks if authenticatedUser is set in props */}
            {(this.props.context.authenticatedUser)  ? (
                <React.Fragment>
                  <svg onClick={this.toggleMenu} className="svg-icon-menu" viewBox="0 0 20 20">
                  <path fill="none" d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
                    c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
                    s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
                    c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
                </svg>
                </React.Fragment>
              ) : (
                <React.Fragment>
                </React.Fragment>
              )}
            </nav>
          </div>  

      : <div className="bounds">

        <Link to="/profile"><h1 className="header--logo"><strong>Quiz</strong>Wiz™</h1></Link>
        <nav className="nav-items">

        <StyleRoot><div style={this.state.fadeIn}><SearchWithContext searchOpen={this.state.searchOpen} searchClick={this.searchClick}/></div></StyleRoot>
            
        {/* Ternary operator checks if authenticatedUser is set in props */}
        {(this.props.context.authenticatedUser)  ? (
            <React.Fragment>
              {/* <span>Welcome, {props.context.authenticatedUser.user.user.name}!</span> */}
              <Link className="header-links" to={`/profile`}>Profile</Link>
              <Link className="header-links" to="/signout">Sign Out</Link>
              <svg onClick={this.toggleMenu} className="svg-icon-menu" viewBox="0 0 20 20">
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
      }
    </header>
        {/* <div className="menu"> */}

          <nav className="menu-navigation">
              <div>
                  <ul className="nav-list">
                      <li><a href="/profile"><svg className="svg-icon-menu-items" viewBox="0 0 20 20">
							<path d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"></path>
						</svg> Home</a></li>
                      <li><a href="/createdecktest"><svg className="svg-icon-menu-items" viewBox="0 0 20 20">
							<path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
						</svg>Create Deck</a></li>
                      <li><a href="/signout"><svg className="svg-icon-menu-items" viewBox="0 0 20 20">
							<path fill="none" d="M16.198,10.896c-0.252,0-0.455,0.203-0.455,0.455v2.396c0,0.626-0.511,1.137-1.138,1.137H5.117c-0.627,0-1.138-0.511-1.138-1.137V7.852c0-0.626,0.511-1.137,1.138-1.137h5.315c0.252,0,0.456-0.203,0.456-0.455c0-0.251-0.204-0.455-0.456-0.455H5.117c-1.129,0-2.049,0.918-2.049,2.047v5.894c0,1.129,0.92,2.048,2.049,2.048h9.488c1.129,0,2.048-0.919,2.048-2.048v-2.396C16.653,11.099,16.45,10.896,16.198,10.896z"></path>
							<path fill="none" d="M14.053,4.279c-0.207-0.135-0.492-0.079-0.63,0.133c-0.137,0.211-0.077,0.493,0.134,0.63l1.65,1.073c-4.115,0.62-5.705,4.891-5.774,5.082c-0.084,0.236,0.038,0.495,0.274,0.581c0.052,0.019,0.103,0.027,0.154,0.027c0.186,0,0.361-0.115,0.429-0.301c0.014-0.042,1.538-4.023,5.238-4.482l-1.172,1.799c-0.137,0.21-0.077,0.492,0.134,0.629c0.076,0.05,0.163,0.074,0.248,0.074c0.148,0,0.294-0.073,0.382-0.207l1.738-2.671c0.066-0.101,0.09-0.224,0.064-0.343c-0.025-0.118-0.096-0.221-0.197-0.287L14.053,4.279z"></path>
						</svg>Sign Out</a></li>
                  </ul>
              </div>
          </nav>
      {/* </div> */}
    </div>

  );
}
}





