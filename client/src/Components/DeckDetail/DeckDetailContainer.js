import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../Card'
// import CreateCard from '../CreateCard'

// import withContext from '../Context';

// const CreateCardWithContext = withContext(CreateCard);

// DeckDetailContainer Component receives props from DeckDetail and renders the jsx

const DeckDetailContainer = props => {
    return (
        <div>

            <div className="bounds deck--detail">
                <div className="grid-66">
                    <div className="deck--header">
                    <h3 className="deck--title">{props.deck.title}</h3>
                    {/* <Link to={`/user/${props.authorId}`}>By {props.deckCreator}</Link> */}
                    </div>
                    <div className="deck--description">
                    </div>
                </div>
            </div>

            {/* check userId against authenticated UsersId to determine if edit buttons display*/}
        {
          (props.authenticatedUserId === props.deck.deck.user._id)
          ? <div className="edit-card-options-container">
                <div className="edit-card-options">
                    <Link className="button" to={`${props.match.url}/updatedecktest`}>Update Deck</Link>
                    <Link className="button" to={`/decks/${props.deck.deck._id}/delete`}>Delete Deck</Link>
                    {/* <Link className="button button-secondary" to="/profile">Return to List</Link> */}
                </div>
            </div>
          : <div className="edit-card-options-container">
                <div className="edit-card-options">
                        {/* <Link className="button button-secondary" to="/decks">Return to List</Link> */}
                </div>
            </div>
        }

            <Card props={props}/>
            {
          (props.authenticatedUserId === props.deck.deck.user._id)
          ? <div className="edit-card-options-container"> 
                            {
                                (props.amountOfCards < 1)
                                    ? <div className="edit-card-options">
                                        <Link className="button button-secondary" to={`/decks/${props.deck.deck._id}/createcard`}>Add Flashcard</Link>
                                    </div>
                                    : <div className="edit-card-options">
                                        <Link className="button button-secondary" to={`/decks/${props.deck.deck._id}/createcard`}>Add Flashcard</Link>
                                        <Link className="button" to={`/decks/${props.deck.cards[props.score]._id}/updatecard`}>Edit Flashcard</Link>
                                        <Link className="button" to={`/decks/${props.deck.cards[props.score]._id}/deletecard`}>Delete Flashcard</Link>                                        
                                    </div>
                            }
                </div>
          : <div className="edit-card-options">
                <div className="bounds">
                    <div className="grid-100">
                        {/* <Link className="button button-secondary" to="/decks">Return to List</Link> */}
                    </div>
                </div>
            </div>
        }
        {/* <CreateCardWithContext /> */}
        </div> 
    );
}

export default DeckDetailContainer;


// {/* <button className="remove-player" onClick={() => props.removePlayer(props.id)}>✖</button> */}
