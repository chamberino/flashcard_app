import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card from '../Card'
import CreateCard from '../CreateCard'

import withContext from '../Context';

const CreateCardWithContext = withContext(CreateCard);

// DeckDetailContainer Component receives props from DeckDetail and renders the jsx

const DeckDetailContainer = props => {
    return (
        <div>
        {/* check userId against authenticated UsersId to determine if edit buttons display*/}
        {
          (props.authenticatedUserId == props.deck.deck.user._id)
          ? <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`${props.match.url}/update`}>Update Deck</Link>
                        </span>
                    <Link className="button" to={`/decks/${props.deck.deck._id}/delete`}>Delete Deck</Link>
                    <Link className="button button-secondary" to="/decks">Return to List</Link>
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
        }
            {/* <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`${props.match.url}/update`}>Update Deck</Link>
                        </span>
                        <Link className="button" to={`/decks/${props.match.url}/delete`}>Delete Deck</Link>
                        <Link className="button button-secondary" to="/decks">Return to List of Decks</Link>
                    </div>
                </div>
            </div> */}

            <div className="bounds deck--detail">
                <div className="grid-66">
                    <div className="deck--header">
                    <h3 className="deck--title">{props.deck.title}</h3>
                    <p>By {props.deckCreator}</p>
                    </div>
                    <div className="deck--description">
                    </div>
                </div>
            </div>
            <Card props={props}/>
            {
          (props.authenticatedUserId == props.deck.deck.user._id)
          ? <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`${props.match.url}/update`}>Edit Flashcard</Link>
                        </span>
                    <Link className="button" to={`/decks/${props.deck.deck._id}/delete`}>Delete Flashcard</Link>
                    <Link className="button button-secondary" to={`/decks/${props.deck.deck._id}/createcard`}>Add Flashcard</Link>
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
        }
        {/* <CreateCardWithContext /> */}
        </div> 
    );
}

export default DeckDetailContainer;


{/* <button className="remove-player" onClick={() => props.removePlayer(props.id)}>✖</button> */}
