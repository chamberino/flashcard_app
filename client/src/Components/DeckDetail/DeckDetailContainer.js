import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';
import UpdateCard from '../UpdateCard';
import withContext from '../Context';


const UpdateCardWithContext = withContext(UpdateCard);

// DeckDetailContainer Component receives props from DeckDetail and renders the jsx

export default class DeckDetailContainer extends Component {
    render(props) {
        let cards = this.props.deck.cards.map((card) => {
            return <UpdateCardWithContext 
                        cardId={card._id}
                        cardCreatorId={this.props.deck.deck.user._id}
                        question={card.question}
                        answer={card.answer}
                        hint={card.hint}
                        originalHint={card.hint}
                        originalQuestion={card.question}
                        originalAnswer={card.answer}
                        deckId={this.props.deck.deck._id}
                        key={card._id}
                        userIsOwner={(this.props.authenticatedUserId === this.props.deck.deck.user._id)}                            
                    />
        })
        // let cards = this.props.deck.cards.map((card) => {
        //     return <div className={`${card._id} card`} key={card._id}>
        //                 <div className="bounds deck--detail">
        //                     <p>{card.question}</p>
        //                     <p>{card.answer}</p>
        //                 </div>    
        //             </div>
        // })
    return (
        <div>

            <div className="bounds deck--detail">
                <div className="deck--header">
                <h3 className="deck--title--play">{this.props.deck.title}</h3>
                {/* <Link to={`/user/${props.authorId}`}>By {props.deckCreator}</Link> */}
                </div>
                <div className="deck--description">
                </div>
            </div>

            {/* check userId against authenticated UsersId to determine if edit buttons display*/}

            <Card props={this.props}/>
            {
          (this.props.authenticatedUserId === this.props.deck.deck.user._id)
          ? <div className="edit-card-options-container"> 
          <Link to={`/user/${this.props.authorId}`} className="author-link">Created by {this.props.deckCreator}</Link>
                            {/* {
                                (this.props.amountOfCards < 1)
                                    ? <div className="edit-card-options">
                                        <Link className="button button-secondary" to={`/decks/${this.props.deck.deck._id}/createcard`}>Add Flashcard</Link>
                                    </div>
                                    : <div className="edit-card-options">
                                        <Link className="button button-secondary" to={`/decks/${this.props.deck.deck._id}/createcard`}>Add Flashcard</Link>
                                        <Link className="button" to={`/decks/${this.props.deck.cards[this.props.score]._id}/updatecard`}>Edit Flashcard</Link>
                                        <Link className="button" to={`/decks/${this.props.deck.cards[this.props.score]._id}/deletecard`}>Delete Flashcard</Link>                                        
                                    </div>
                            } */}
                            {
                                (this.props.authenticatedUserId === this.props.deck.deck.user._id)
                                ? <div className="edit-card-options-container">
                                        <div className="edit-card-options">
                                            <Link className="button edit-deck-button" to={`${this.props.match.url}/updatedecktest`}><svg className="svg-icon-newDeck" viewBox="0 0 20 20">
							                    <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
						                    </svg> Edit Deck </Link>
                                            <Link className="button delete-deck-button" to={`/decks/${this.props.deck.deck._id}/delete`}><svg className="svg-icon-delete" viewBox="0 0 20 20">
							<path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
						</svg>Delete Deck</Link>
                                        </div>
                                    </div>
                                : <div className="edit-card-options-container">
                                        <div className="edit-card-options">
                                                {/* <Link className="button button-secondary" to="/decks">Return to List</Link> */}
                                        </div>
                                    </div>
                             }
                </div>
          : <div className="edit-card-options-container">
                <div className="bounds">
                    <div className="grid-100">
                        {/* <Link className="button button-secondary" to="/decks">Return to List</Link> */}
                    </div>
                </div>
            </div>
        }   
        {  
        (this.props.authenticatedUserId === this.props.deck.deck.user._id)
            ? <div className="cards">{cards}</div>
            : null         
        }
        </div> 
    );
}
}

// let decks = props.data.map( (result) => { 
//     // For each deck received in props, return a Deck component with relevant data
//     return <Deck title={result.title} id={result._id} history={props.history} key={result._id}/>
//   });



// {/* <button className="remove-player" onClick={() => props.removePlayer(props.id)}>✖</button> */}
