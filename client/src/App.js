import React, { Component } from 'react';

import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Courses from './Components/Users';

export default class App extends Component {
  // Constructor initializes state //
  
    state = {
    };

  render() {
    return (         
      <div>
      <BrowserRouter>
        <Courses></Courses>
      </BrowserRouter>    
      </div> 
    );
  }
}
