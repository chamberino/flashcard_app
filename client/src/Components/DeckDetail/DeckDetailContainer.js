import React from 'react';
import { Link } from 'react-router-dom';

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

            <div className="bounds card--detail">
                <div className="grid-66">
                    <div className="card">
                    <h3 className="card--question">{props.deck.cards[0].question}</h3>
                    <button className="remove-player" >✖</button>
                    </div>
                    <div className="course--description">
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default DeckDetailContainer;


{/* <button className="remove-player" onClick={() => props.removePlayer(props.id)}>✖</button> */}
