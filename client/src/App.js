import React, { Component } from 'react';

import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// Import App Components
import Header from './Components/Header';
import Decks from './Components/Decks/Decks';
import DeckDetail from './Components/DeckDetail/DeckDetail';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import ErrorPage from './Components/Error';
import Forbidden from './Components/Forbidden'
import NotFound from './Components/NotFound';

export default class App extends Component {
  // Constructor initializes state //
  
    state = {
    };

  render() {
    return (         
      <div>
      <BrowserRouter>
        <Header />
        <Switch>     
          <Route exact path="/" render={ () => <Redirect to="/decks/" /> } />

          <Route path="/signin" component={UserSignIn} />
          <Route path="/signup" component={UserSignUp} />


          <Route exact path="/decks" component={Decks} />
          <Route path="/decks/:id" component={DeckDetail} />

          <Route exact path="/notfound" component={NotFound}/>
          <Route exact path="/error" component={ErrorPage}/>
          <Route exact path="/forbidden" component={Forbidden}/>


        </Switch>     
      </BrowserRouter>    
      </div> 
    );
  }
}
