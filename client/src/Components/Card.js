import React from 'react';

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
        {/* instead of rendering next and previous as null change class so you can gray out buttons */}
        {
            (props.props.score > 0)
                ? <button className="previous-card" onClick={props.props.previousCard}> previous card </button>
                : (null)
        }
        {
            (props.props.score < props.props.amountOfCards-1)
                ?<button className="next-card" onClick={props.props.nextCard}> next card </button>
                : (null)
        }
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
    <p>{props.props.score+1}/{props.props.amountOfCards}</p>
    {/* {
          (props.props.authenticatedUserId == props.props.deck.deck.user._id)
          ? <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`${props.props.match.url}/update`}>Edit Flashcard</Link>
                        </span>
                    <Link className="button" to={`/decks/${props.props.deck.deck._id}/delete`}>Delete Flashcard</Link>
                    <Link className="button button-secondary" to={`/decks/${props.props.deck.deck._id}/createcard`}>Add Flashcard</Link>
                </div>
            </div>
            </div>
          : <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <Link className="button button-secondary" to="/decks">Return to List</Link>
                    </div>
                </div>
            </div>
        } */}
</div>

)
export default Card;
// {/* <button className="counter-action increment" onClick={this.incrementScore}> + </button> */}