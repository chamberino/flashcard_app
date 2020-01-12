import React from 'react';
import Deck from './Deck'

/* 
This component receives its props from Decks 
The data is mapped over returning an array of Deck components with props available
for each deck containing the respective data
*/

const DeckContainer = (props) => {

  if (props.data !== undefined && props.user !==undefined) {
    let decks = props.data.map( (result) => { 
      // For each deck received in props, return a Deck component with relevant data
      return <Deck title={result.title} id={result._id} history={props.history} key={result._id} user={result.user.username}/>
    });
    return(
      <div className="deck-list">
        {
          (props.data.length > 0)
              ? decks
              : <h3>{props.user} doesn't have any decks.</h3>
        }
      </div>
    ); 
  } else if (props.data !== undefined) {
      let decks = props.data.map( (result) => { 
        // For each deck received in props, return a Deck component with relevant data
        return <Deck title={result.title} id={result._id} history={props.history} key={result._id} user={result.user.username}/>
      });
      return(
        <div className="deck-list">
        {
          (props.data.length > 0)
              ? decks
              : <h3>Sorry, we couldn't find any decks matching "{props.searchTerm}"</h3>
        }
        </div>
    );
} else {
    return(
      <div className="deck-list">
        <h3>Sorry, we couldn't find any decks matching "{props.searchTerm}"</h3>
      </div>
    ); 
  }
}

  export default DeckContainer;