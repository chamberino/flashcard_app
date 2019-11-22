import React, { Component } from 'react';
import Form from './Form';


export default class UpdateCardWithContext extends Component {

  constructor(props) {
    super(props);
  this.state= {
    // make the card id available as you map over it in deckdetailcontainer
    // It used to get the id available from params when it was a standalone page
  // cardId: props.match.params.id,
  cardId: props.cardId,
  originalQuestion: '',
  originalAnswer: '',
  originalHint: '',
  preservedQuestion: '',
  preservedAnswer: '',
  preservedHint: '',
  deck: '',
  question: '',
  answer: '',
  hint: '',
  errors: [],
  // Pass authenticated user and deck userId from deckdetailcontainer
  user: props.context.authenticatedUser.user.user.name,
  userId: props.context.authenticatedUser.user.user.id,
  isDisabled: true
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
            originalQuestion: card.card.question,
            originalAnswer: card.card.answer,
            originalHint: card.card.hint,
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

cardFocus = (e) => {
  const card = document.getElementById(`${this.props.cardId}`);
  const input = document.querySelectorAll(`.input-${this.props.cardId}`);
  const svg = document.getElementById(`svg-${this.props.cardId}`);
  const formButtons = document.querySelector(`.form-buttons-update-${this.props.cardId}`);
  input.forEach(input=>input.disabled=false);
  svg.classList.toggle("svg-edit-active");
  formButtons.style.display="flex";
  card.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}

  render() {
    const {
        question,
        answer,
        hint,
        errors,
        isDisabled
    } = this.state;
    return (
      <div className="bounds deck--detail">
        <div className="card" id={this.state.cardId}>
          <Form 
              cancel={this.cancel}
              errors={errors}
              submit={this.submit}
              submitButtonText="Update"
              formButtonsClass={`form-buttons-update form-buttons-update-${this.state.cardId}`}
              // elements prop is a function  which returns
              // the input fields to be used in each of the forms
              elements={() => (
                <React.Fragment>
              <div className="grid-66">
                <div className="deck--header update-card">
                <svg onClick={this.cardFocus} className="svg-edit-inactive svg-flex" id={`svg-${this.state.cardId}`} viewBox="0 0 20 20">
                                <path fill="none" d="M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z"></path>
                </svg>
                  <div className="inputs">
                  <label>                  
                    <input 
                      disabled={isDisabled}
                      id="question" 
                      name="question" 
                      type="text" 
                      className={`input-question deck--question--input input-${this.state.cardId}`}
                      onChange={this.change} 
                      placeholder={question}
                      value={question}
                      />
                  {/* Question */}
                  </label>
                  <label>                  
                    <input 
                      disabled={isDisabled}
                      id="answer" 
                      name="answer" 
                      type="text" 
                      className={`input-answer deck--answer--input input-${this.state.cardId}`}
                      onChange={this.change} 
                      placeholder="Bismark" 
                      value={answer}
                      />
                    {/* Answer   */}
                  </label>

                  {
                    hint
                  ? <label>                  
                    <input 
                      disabled={isDisabled}
                      id="hint" 
                      name="hint" 
                      type="text" 
                      className={`input-hint deck--hint--input input-${this.state.cardId}`}
                      onChange={this.change} 
                      // placeholder="Otto Van..." 
                      value={hint}
                      />
                    {/* Hint   */}
                  </label>
                  : null
                  }
                  </div>
                </div>
                {this.state.subjects}
              </div>
          </React.Fragment>
            )} />
        </div>
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
    console.log(cardPayload)

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
        // this.props.history.push(`/decks/` + deckId);
        return response
      }
    })
    .catch((error) => {
      // catch errors and push new route to History object
      this.props.history.push('/error');
    });
}

  cancel = () => {
    this.setState({ question: this.state.originalQuestion, answer: this.state.originalAnswer, hint: this.state.originalHint });
  }
}