import React, { Component } from 'react';
import Form from './Form';


export default class UpdateCardWithContext extends Component {

  constructor(props) {
    super(props);
  this.state= {
  cardId: props.match.params.id,
  preservedQuestion: '',
  preservedAnswer: '',
  preservedHint: '',
  deck: '',
  question: '',
  answer: '',
  hint: '',
  errors: [],
  user: props.context.authenticatedUser.user.user.name,
  userId: props.context.authenticatedUser.user.user.id,
  };
}

componentDidMount() {  
  // Make a call to the API to get all the cards in the DB.

this.props.context.actions.getCard(this.state.cardId)
      .then((card)=>{
        this.setState({
            card: card,
          })
        if (card.errorStatus || card.message) {
            this.props.history.push(`/notfound`);
            return null
          } else {
          this.setState({
            question: card.card.question,
            answer: card.card.answer,
            hint: card.card.hint,
            cardCreatorId: card.userId,
            foundCard: true,
            cardId: card.cardId,
            deckId: card.deckId
          })
        }
    }).catch((error)=>{
            // catch errors and push new route to History object
        this.props.history.push('/error');
    })
}

  render() {
    const {
        question,
        answer,
        hint,
        errors,
        user,
        deckTitle
    } = this.state;
    return (
      <div className="bounds deck--detail">
        <h1>Edit Flashcard for {deckTitle} Deck</h1>
        <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Card"
            // elements prop is a function  which returns
            // the input fields to be used in each of the forms
            elements={() => (
              <React.Fragment>
            <div className="grid-66">
              <div className="deck--header">
                <h4 className="deck--label">Deck</h4>
                <div>
                <label>
                Question
                  <input 
                    id="question" 
                    name="question" 
                    type="text" 
                    className="input-question deck--question--input" 
                    onChange={this.change} 
                    placeholder={question}
                    value={question}
                     />
                </label>
                <label>
                Answer
                  <input 
                    id="answer" 
                    name="answer" 
                    type="text" 
                    className="input-answer deck--answer--input" 
                    onChange={this.change} 
                    placeholder="Bismark" 
                    value={answer}
                     />
                </label>
                <label>
                Hint
                  <input 
                    id="hint" 
                    name="hint" 
                    type="text" 
                    className="input-hint deck--hint--input" 
                    onChange={this.change} 
                    placeholder="Otto Van..." 
                    value={hint}
                     />
                </label>
                </div>
                <p>By {user}</p>
              </div>
              {this.state.subjects}
            </div>
        </React.Fragment>
          )} />
      </div>
    );
  }

  change = (event) => {
    // Any changes made in the input fields will update it's corresponding property in state
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value,      
      };
    });
  }

  submit = () => {
    // Data is passed to the component via a prop named context. 
    // Destructuring is used to extract the value from props. 
    const { context } = this.props;

    // unpack the name, username and password properties from 
    // the state object (this.state) into distinct variables
    const {
      question,
      answer,
      hint,
      userId,
      cardId,
      deckId
    } = this.state;

    this.setState({ preservedQuestion: question, preservedAnswer: answer, preservedHint: hint, userId: userId });
    
    // Initialize a variable named deckPayload to an object 
    // containing the necessary data to make a call to the API to create a deck
    const cardPayload = {
      question: question,
      answer: answer,
      hint: hint,
      deck: deckId,
    }

    // Store the users credentials in an object so it can be passed along to the API to authenticate the user
    const credentials = this.props.context.authenticatedUser.user.token;
    // Create deck by calling the create method made available through Context
    // The deck data and users credentials are passed along.
    context.actions.update(`/card/${cardId}/update`, cardPayload, credentials)
    .then((response) => {
      // If API returns a response that is not 201, set the errors property in state to the response. 
      // The response will carry any error messages in an array. The title and description are then initialized.
      if (response.status !== 204) {
        this.setState({ errors: response });
        // this.setState({title: this.state.preservedTitle})
      } else {
        // response.headers.get('Location');
        // The errors property is set to the response, which should be empty. The user is sent to the decks list.
        this.setState({ errors: [] });
        // this.setState({title: title});
        // response.id
        this.props.history.push(`/decks/` + deckId);
        return response
      }
    })
    .catch((error) => {
      // catch errors and push new route to History object
      this.props.history.push('/error');
    });
}

  cancel = () => {
    // access the history object via props, and push the error route
    this.props.history.push('/');
  }
}