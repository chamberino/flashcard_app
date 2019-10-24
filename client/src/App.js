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
import Card from './Components/Card';
import CreateDeck from './Components/CreateDeck';
import UpdateDeck from './Components/UpdateDeck';
import DeleteDeck from './Components/DeleteDeck';
import CreateCard from './Components/CreateCard';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import ErrorPage from './Components/Error';
import Forbidden from './Components/Forbidden'
import NotFound from './Components/NotFound';

// Connect the App Component to Context
import withContext from './Components/Context';
// Import the PrivateRoute Component
import PrivateRoute from './PrivateRoute';

const HeaderWithContext = withContext(Header);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const DecksWithContext = withContext(Decks);
const DeckDetailWithContext = withContext(DeckDetail);
const CreateDeckWithContext = withContext(CreateDeck);
const UpdateDeckWithContext = withContext(UpdateDeck);
const DeleteDeckWithContext = withContext(DeleteDeck);
const CreateCardWithContext = withContext(CreateCard)

export default class App extends Component {
  // Constructor initializes state //
  
    state = {
    };

  render() {
    return (         
      <div>
      <BrowserRouter>
        <HeaderWithContext />
        <Switch>     
          <Route exact path="/" render={ () => <Redirect to="/decks/" /> } />

          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signup" component={UserSignUp} />
          <Route path="/signout" component={UserSignOutWithContext} />


          <PrivateRoute exact path="/decks/create/" component={CreateDeckWithContext}/>
          <Route exact path="/decks" component={DecksWithContext} />
          <PrivateRoute path="/decks/:id/update/" component={UpdateDeckWithContext} />
          <PrivateRoute path="/decks/:id/delete/" component={DeleteDeckWithContext} />
          <PrivateRoute path="/decks/:id/createcard/" component={CreateCardWithContext} />
          <Route path="/decks/:id" component={DeckDetailWithContext} />
          <Route exact path="/decks/:id/:cardId" component={Card} />

          <Route exact path="/notfound" component={NotFound}/>
          <Route exact path="/error" component={ErrorPage}/>
          <Route exact path="/forbidden" component={Forbidden}/>


        </Switch>     
      </BrowserRouter>    
      </div> 
    );
  }
}
