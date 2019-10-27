import React, { Component } from 'react';

import {
  Route,
  Switch
} from 'react-router-dom';
import NewDeckLink from '../NewDeckLink';
import DeckContainer from './DeckContainer';

/* 
This stateful component retreives all the decks in the database once the component mounts. 
A decks property is set in state with a value of the retrived decks list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class Decks extends Component {
// Constructor initializes state //

  constructor(props) {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      decks: [],
      loading: true,
      // credentials: props.context.authenticatedUser.user.token
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the decks in the DB.
    this.props.context.actions.getDecks()
    // Set value of returned decks to the decks property in state. Change loading property to false.
      .then(decks=>{
        this.setState({
          decks: decks.deck_list,
          loading: false
        })
      }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
      })
  }

  render() {

    return (         
      <div className="deck-list-container">
      <Route exact path="/decks/" render= {() => <NewDeckLink />} />
      <Switch>
      {/* Ternary operator determined whether to display loading message or render DeckContainer Component */}
      {
        (this.state.loading)
        ? <Route exact path="/decks" render= {() => <p>Loading...</p>  } />
        : <Route exact path="/decks" render= {()=><DeckContainer data={this.state.decks}/> } />
      } 
      </Switch>
      {/* The NewDeckLink is set outside Switch so that it will always render even if no decks are available */}
        <div className="main-content">
        </div>  
      </div>
    );
  }
}