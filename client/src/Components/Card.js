import React from 'react';
import { Link } from 'react-router-dom';

/* 
  Deck component receives props from DecksContainer
  The props passed down in DecksContainer from Decks is mapped over returning 
  this Deck component for each deck in the decks array returned from the API
*/
const Card = props => (
<div className="bounds card--detail">
{/* Check to see if there are flashcards in deck */}
{ (props.props.amountOfCards <= 0)
        ? (<p>There are no flashcards in this deck</p>)
        : (
      
    <div className="grid-66">
        <div className="card">
        <h3 className="card--question">{props.props.deck.cards[props.props.score][props.props.sideOfCard]}</h3>
        <button className="flip-card" onClick={props.props.flipCard}>flip card</button>
        <button className="previous-card" onClick={props.props.previousCard}> previous card </button>
        <button className="next-card" onClick={props.props.nextCard}> next card </button>
        <button className="show-hint" onClick={props.props.showHint}> show hint </button>

        </div>
        <div className="card--hint">
        { (props.props.hint == null)
        ? (<p></p>)
        : (
      
    <div className="grid-66">
        <div className="card">
        <h3 className="card--hint">{props.props.deck.cards[props.props.score][props.props.hint]}</h3>
        </div>
    </div>
        )
    }
        </div>
    </div>
        )
    }
</div>

)
export default Card;
{/* <button className="counter-action increment" onClick={this.incrementScore}> + </button> */}