import React, { Component } from 'react';

import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// Import App Components
import Header from './Components/Header';
// import Menu from './Components/Menu';
import Test from './Components/Test';
import CreateDeckTest from './Components/CreateDeckTest';
import ProfileDetail from './Components/Profile/ProfileDetail';
import Users from './Components/Users/Users';
import UserDetail from './Components/Users/UserDetail';
import Subjects from './Components/Subjects/Subjects';
import SubjectDetail from './Components/Subjects/SubjectDetail';
import Decks from './Components/Decks/Decks';
import DeckDetail from './Components/DeckDetail/DeckDetail';
import DeckSearch from './Components/Decks/DeckSearch';
import Card from './Components/Card';
import CreateDeck from './Components/CreateDeck';
import UpdateDeck from './Components/UpdateDeck';
import UpdateDeckTest from './Components/UpdateDeckTest';
import DeleteDeck from './Components/DeleteDeck';
import CreateCard from './Components/CreateCard';
import DeleteCard from './Components/DeleteCard';
import UpdateCard from './Components/UpdateCard';
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
const UserSignUpWithContext = withContext(UserSignUp)
const UserSignOutWithContext = withContext(UserSignOut);
const ProfileDetailWithContext = withContext(ProfileDetail);
const UsersWithContext = withContext(Users);
const UserDetailWithContext = withContext(UserDetail);
const DeckSearchWithContext = withContext(DeckSearch);
const SubjectsWithContext = withContext(Subjects);
const SubjectDetailWithContext = withContext(SubjectDetail);
const DecksWithContext = withContext(Decks);
const DeckDetailWithContext = withContext(DeckDetail);

const CreateDeckTestWithContext = withContext(CreateDeckTest);
const CreateDeckWithContext = withContext(CreateDeck);
const UpdateDeckTestWithContext = withContext(UpdateDeckTest);
const UpdateDeckWithContext = withContext(UpdateDeck);
const DeleteDeckWithContext = withContext(DeleteDeck);
const CreateCardWithContext = withContext(CreateCard);
const DeleteCardWithContext = withContext(DeleteCard)
const UpdateCardWithContext = withContext(UpdateCard);

export default class App extends Component {
  // Constructor initializes state //
  
    state = {
    };

  render() {
    return (         
      <div className="main">
      <BrowserRouter>
        <HeaderWithContext />
        {/* <Menu /> */}
        <Switch>     
          <Route exact path="/" render={ () => <Redirect to="/profile/" /> } />

          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signup" component={UserSignUpWithContext} />
          <Route path="/signout" component={UserSignOutWithContext} />

          <Route path="/decksearch/:category/:term" component={DeckSearchWithContext} />


          {/* <Route exact path="/profile" component={ProfileWithContext} /> */}
          <PrivateRoute exact path="/profile" component={ProfileDetailWithContext} />
          <Route exact path="/users" component={UsersWithContext} />
          <Route exact path="/user/:id" component={UserDetailWithContext} />

          <Route exact path="/subjects" component={SubjectsWithContext} />
          <Route exact path="/subject/:id" component={SubjectDetailWithContext} />

          <PrivateRoute exact path="/decks/create/" component={CreateDeckWithContext}/>
          <Route exact path="/decks" component={DecksWithContext} />
          <PrivateRoute path="/decks/:id/update/" component={UpdateDeckWithContext} />
          <PrivateRoute path="/decks/:id/updatedecktest/" component={UpdateDeckTestWithContext} />
          <PrivateRoute path="/decks/:id/delete/" component={DeleteDeckWithContext} />
          <PrivateRoute path="/decks/:id/createcard/" component={CreateCardWithContext} />
          <PrivateRoute path="/decks/:id/deletecard/" component={DeleteCardWithContext} />
          <PrivateRoute path="/decks/:id/updatecard/" component={UpdateCardWithContext} />      
          <Route path="/decks/:id" component={DeckDetailWithContext} />
          <Route exact path="/decks/:id/:cardId" component={Card} />

          <PrivateRoute exact path="/createDeckTest" component={CreateDeckTestWithContext} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/notfound" component={NotFound}/>
          <Route exact path="/error" component={ErrorPage}/>
          <Route exact path="/forbidden" component={Forbidden}/>

          <Route component={NotFound}/>
        </Switch>     
      </BrowserRouter>    
      </div> 
    );
  }
}
