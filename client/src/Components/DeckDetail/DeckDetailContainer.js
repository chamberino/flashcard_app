import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card from '../Card'

// DeckDetailContainer Component receives props from DeckDetail and renders the jsx

const DeckDetailContainer = props => {
    return (
        <div>
        {/* check userId against authenticated UsersId to determine if edit buttons display*/}

            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <Link className="button" to={`${props.match.url}/update`}>Update Deck</Link>
                        </span>
                        <Link className="button" to={`/courses/${props.course}/delete`}>Delete Deck</Link>
                        <Link className="button button-secondary" to="/decks">Return to List of Decks</Link>
                    </div>
                </div>
            </div>

            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                    <h3 className="course--title">{props.deck.title}</h3>
                    <p>By {props.deckCreator}</p>
                    </div>
                    <div className="course--description">
                    </div>
                </div>
            </div>
            <Card props={props}/>
        </div> 
    );
}

export default DeckDetailContainer;


{/* <button className="remove-player" onClick={() => props.removePlayer(props.id)}>✖</button> */}
