import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

/* 
  User component receives props from UsersContainer
  The props passed down in UsersContainer from Users is mapped over returning 
  this User component for each user in the users array returned from the API
*/

const CreateCardInputs = props => (
      <React.Fragment>
    <div className="grid-66">
      <div className="deck--header">
        <h4 className="deck--label">Card {props.cardNumber}</h4>
        <div>
        <label>
        Question
          <input 
            id="question" 
            name="question" 
            type="text" 
            className="input-question deck--question--input" 
            onChange={props.onChange} 
            placeholder="What is the capital of North Dakota" 
            value={props.hint}
             />
        </label>
        <label>
        Answer
          <input 
            id="answer" 
            name="answer" 
            type="text" 
            className="input-answer deck--answer--input" 
            onChange={props.onChange} 
            placeholder="Bismark" 
            value={props.answer}
             />
        </label>
        <label>
        Hint
          <input 
            id="hint" 
            name="hint" 
            type="text" 
            className="input-hint deck--hint--input" 
            onChange={props.onChange} 
            placeholder="Otto Van..." 
            value={props.hint}
             />
        </label>
        </div>
        <p>By Someone</p>
      </div>
      {/* {this.state.subjects} */}
    </div>
</React.Fragment>
);

export default CreateCardInputs;