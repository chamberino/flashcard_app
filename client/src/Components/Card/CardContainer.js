import React from 'react';
import { Link } from 'react-router-dom';

/* 
  Deck component receives props from DecksContainer
  The props passed down in DecksContainer from Decks is mapped over returning 
  this Deck component for each deck in the decks array returned from the API
*/
// Use the ternary operator to render a question or answer
// Use a boolean for sideOfCard property in state that changes each time a 
const Card = props => (
<div className="bounds card--detail">
{ (props.sideOfCard)
        ? (<p>There are no flashcards in this deck</p>)
        : (
      
    <div className="grid-66">
        <div className="card">
        <h3 className="card--question">{props.props.deck.cards[props.props.score].question}</h3>
        <h1>{props.props.score}</h1>
        <button className="flip-card" onClick={props.props.previousCard}>flip card</button>
        <button className="next-card" onClick={props.props.nextCard}> + </button>
        <button className="previous-card" onClick={props.props.previousCard}> - </button>
        </div>
        <div className="course--description">
        </div>
    </div>
        )
    }
    <div className="grid-66">
        <div className="card">
        <h3 className="card--question">{props.props.deck.cards[0].question}</h3>
        <button className="remove-player" >✖</button>
        </div>
        <div className="course--description">
        </div>
    </div>
</div>

)
export default Card;
            