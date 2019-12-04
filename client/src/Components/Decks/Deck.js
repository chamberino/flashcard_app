import React from 'react';
import { Link } from 'react-router-dom';

/* 
  Deck component receives props from DecksContainer
  The props passed down in DecksContainer from Decks is mapped over returning 
  this Deck component for each deck in the decks array returned from the API
*/

const Deck = props => (
  <div>
    <Link className="deck--module deck--link" to={'/decks/' + props.id}>
            <div className="deck"><h3 className="deck--title">{props.title}</h3>
            <p className="deck--user" >{props.user}</p></div>
      </Link>
      
      {/* <Link className="deck--module deck--link" to={'/users/' + props.user}>
            <div className="deck"><h3 className="deck--title">{props.user}</h3></div>
      </Link> */}
  </div>
);

export default Deck;

