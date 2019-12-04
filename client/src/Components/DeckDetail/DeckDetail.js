import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import withContext from '../Context';
import DeckDetailContainer from './DeckDetailContainer';
// import NotFound from '../NotFound';

import { fadeInRight, fadeInLeft, flipInX, flipOutX } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const DeckDetailContainerWithContext = withContext(DeckDetailContainer);


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
      fade: {},
      fadeInRight: {
        animation: 'x 2s',
        animationName: Radium.keyframes(fadeInRight, 'fadeInRight')
      },
      fadeInLeft: {
        animation: 'x 2s',
        animationName: Radium.keyframes(fadeInLeft, 'fadeInLeft')
      },
      flipInX: {
        animation: 'x 2s',
        animationName: Radium.keyframes(flipInX, 'flipInX')
      },
      flipOutX: {
        animation: 'x 2s',
        animationName: Radium.keyframes(flipOutX, 'flipOutX')
      },
      sideOfCard: '',  
      hint: null,
      id: props.match.params.id,
      deck: {},
      deckCreator: '',
      deckURL: props.match.url,
      loading: true,
      authenticatedUser: {},
      score: 0,
      isFlipped: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  nextCard = () => {
    if (this.state.score < this.state.amountOfCards-1) {  
      // document.querySelector('.card-container').style.animation = "0.5s ease 0s 1 normal none running fadeInRight-radium-animation-2beba6ab";
      document.querySelector('.card-container').style.animation = "0.5s ease 0s 1 normal none running fadeInRight-radium-animation-2beba6ab";

      setTimeout(() => { 
        document.querySelector('.card-container').style.animation = null;
    }, 500);

        this.setState( prevState => ({
        fade: this.state.fadeInRight,  
        score: prevState.score + 1,
        sideOfCard: 'question',
        hint: null
        }));
    }   
}

  previousCard = () => {
    if (this.state.score > 0) {  
      document.querySelector('.card-container').style.animation = "0.5s ease 0s 1 normal none running fadeInLeft-radium-animation-1685c3c6";
      setTimeout(() => { 
        document.querySelector('.card-container').style.animation = null;
    }, 500);

        this.setState( prevState => ({  
        fade: this.state.fadeInLeft,
        score: prevState.score - 1,
        sideOfCard: 'question',
        hint: null
        }));
    }
}

flipCard = () => {
  this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  if (this.state.sideOfCard === 'question') {  
    document.querySelector('.card-container').style.animation = "2s ease 0s 1 normal none running flipInX-radium-animation-1b99838f"
    setTimeout(() => { 
      document.querySelector('.card-container').style.animation = null;
  }, 500);

      this.setState( prevState => ({  
      sideOfCard: 'answer',
      fade: this.state.flipInX,
      }));
  } else {
    document.querySelector('.card-container').style.animation = "0.5s ease 0s 1 normal none running flipOutX-radium-animation-2af0a5f5";
    document.querySelector('.card--question').style.display = "none"
    // document.querySelector('.card-container').style.animation = "0.5s ease 0s 1 normal none running flipInX-radium-animation-1b99838f"
    setTimeout(() => { 
      document.querySelector('.card-container').style.animation = null;
      document.querySelector('.card--question').style.display = ""
  }, 500);

    this.setState( prevState => ({  
      sideOfCard: 'question',
      fade: this.state.flipOutX,
      }));
  }
}

showHint = () => {
  if (this.state.hint == null) {  
      this.setState( prevState => ({  
      hint: 'hint'
      }));
  } else {
    this.setState( prevState => ({  
      hint: null
      }));
  }
}

componentDidMount() {
  // If user is signed in, set an authenticatedUser property with the users id. This will be sent to the 
  // DeckDetailContainer Component to determine which options will be available to the user.
  if (this.props.context.authenticatedUser) {
    this.setState({
    authenticatedUser: this.props.context.authenticatedUser.user.user.id 
    })
  }
  // Make a call to the API to grab the deck using the url param set to the id property in state
  this.props.context.actions.getDeck(this.state.id)
      .then(deck => {
        if (deck.errorStatus || deck.message) {
          this.props.history.push(`/notfound`);
          return null;
        } else {
          this.setState({              
              hint: null,
              sideOfCard: 'question',
              amountOfCards: deck.cards.length,
              deck: deck,
              authorId: deck.deck.user._id,
              deckTitle: deck.title,
              deckCreator: deck.deck.user.username,
              loading: false,
              jsx: <Route exact path="/decks/:id" render = {({match})=> 
                  <DeckDetailContainerWithContext
                      fade={this.state.fade}
                      fadeInRight={this.state.fadeInRight}
                      fadeInLeft={this.state.fadeInLeft}
                      flipInX={this.state.flipInX}
                      authenticatedUserId={this.state.authenticatedUser} 
                      authorId={this.state.authorId}  
                      hint={this.state.hint}
                      sideOfCard={this.state.sideOfCard}
                      amountOfCards={this.state.amountOfCards}
                      nextCard={this.nextCard}
                      previousCard={this.previousCard}
                      flipCard={this.flipCard}
                      showHint={this.showHint}
                      score={this.state.score}
                      deckCreator={this.state.deckCreator}                  
                      deck={this.state.deck} 
                      isFlipped={this.state.isFlipped}
                      handleClick={this.handleClick}
                      match={match}/> } />                      
          });
        }
      }).catch((error)=>{
          // catch errors and push new route to History object
          this.props.history.push('/error');
        })
}

  render() {
    return (    
      <div className="main-content">
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
