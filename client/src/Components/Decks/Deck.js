import React from 'react';
import { Link } from 'react-router-dom';

/* 
  Deck component receives props from DecksContainer
  The props passed down in DecksContainer from Decks is mapped over returning 
  this Deck component for each deck in the decks array returned from the API
*/

const Deck = props => (
  <div className="grid-33"><Link className="deck--module course--link" to={'/decks/' + props.id}>
          <h3 className="deck--title">{props.title}</h3>
    </Link></div>
);

export default Deck;

