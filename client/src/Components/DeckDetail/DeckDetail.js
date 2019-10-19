import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import axios from 'axios';
// import withContext from '../Context';
import DeckDetailContainer from './DeckDetailContainer';
// import NotFound from '../NotFound';

// const DeckDetailContainerWithContext = withContext(DeckDetailContainer);


/* 
  This stateful component retreives an individual deck from the Flashcard_App API once the component mounts. 
  A deck property is set in state with a value of the retrieved deck. 
  The match object is passed down from App.js allowing us to fetch individual deck data
  using the url param for each deck, which is the same as each decks id.

  Until the data is retreived and the component is successfully rendered, a loading state property is set to true.
  As long as this property is set to true, a loading component will be rendered 

  The deck property set in state is passed along to the DeckDetailContainer component 
  once the data loads and the component is able to mount.
*/

export default class DeckDetail extends Component {
  // Constructor initializes state //
  
  constructor(props) {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      id: props.match.params.id,
      deck: {},
      deckCreator: '',
      deckURL: props.match.url,
      loading: true,
      authenticatedUser: {},
    };
  }

  componentDidMount() {
    // If user is signed in, set an authenticatedUser property with the users id. This will be sent to the 
    // DeckDetailContainer Component to determine which options will be available to the user.

    // Make a call to the API to grab the deck using the url param set to the id property in state

    axios(`http://localhost:5000/catalog/deck/${this.state.id}`)
        .then(deck => {
            this.setState({
                deck: deck.data,
                deckTitle: deck.data.title,
                deckCreator: deck.data.deck.user.first_name + ' ' + deck.data.deck.user.last_name,
                loading: false,
                jsx: <Route exact path="/decks/:id" render = {({match})=> 
                    <DeckDetailContainer
                        deckCreator={this.state.deckCreator}                  
                        deck={this.state.deck} 
                        match={match}/> } />
            })
        }).catch(()=>{
            // catch errors and push new route to History object
            this.props.history.push('/error');
          })
  }

  render() {
    return (    
      <div>
      {/* Provide a loading message or render the DeckDetailContainer Component.*/}
      <Switch>
        {
          (this.state.loading)
          ? <Route exact path="/decks/:id" render= {() => <p>Loading...</p>  } />
          : (this.state.jsx)
        }
      </Switch>
        <div className="main-content">
        </div>
      </div>
    );
  }
}


{/* <Route exact path="/deck/:id" render= {({match})=> 
                        <DeckDetailContainer
                            deckCreator={this.state.deckCreator}                  
                            deck={this.state.deck} 
                            match={match}/> } />  */}


{/* <Route exact path="deck/:id" render = {({match}) => 
<h1>Jello World</h1>
} /> */}