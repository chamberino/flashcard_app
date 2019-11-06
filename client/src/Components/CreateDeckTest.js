import React, { Component } from 'react';
import Checkbox from './Checkbox';
import Form from './Form';

export default class CreateDeckWithContext extends Component {

  constructor(props) {
    super(props);
  this.state= {

  cards: [{ question: "", answer: "" , hint: ""}],
  checkboxes: [],
  select: [],
  subject: '',
  checkedItems: new Map(),
  checkedItemsIds: new Map(),
  preservedTitle: '',
  title: '',      
  subjects: [],           
  subjectsChecked: [],           
  errors: [],
  searchText: '',
  nameError: '',
  subjectError:'',
  cardError: '',
  cardErrors: [],
  questionErrors: [],
  answerErrors: [],
  user: props.context.authenticatedUser.user.user.name,
  userId: props.context.authenticatedUser.user.user.id,
  };

//   this.handleChange = this.handleChange.bind(this);
}

// handleChange(e) {
//   const label =e.target.value;
//   const item = e.target.name;
//   const isChecked = e.target.checked;
//   this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked), checkedItemsIds: prevState.checkedItemsIds.set(label, isChecked) }));
// }

errorsExist = () => {
  if 
  (this.state.title.length < 1 ||
      this.state.subject.length < 1 ||
      (this.state.cards.filter((card) => {
        return card.question === "" ||  card.question === undefined})).length > 0 ||
        (this.state.cards.filter((card) => {
          return card.answer === "" || card.answer === undefined})).length > 0         
        ) {return true}
}

validatedName = () => {
  if (this.state.title.length < 1) {
    this.setState( prevState => {
    return {
            errors: [
              ...prevState.errors,
              'Please enter valid title'
            ],
            nameError:"error"            
      }
    })
  } else {
    return null
  }
}

validatedSubject = () => {
  if (this.state.subject.length < 1) {
    this.setState( prevState => {
    return {
            errors: [
              ...prevState.errors,
              'Please choose a subject'
            ],
            subjectError:"error"   
      }
    })
  }
}

validatedQuestions = () => {
  this.setState({questionErrors: []})
  this.state.cards.map((card) => {
    if (card.question == "") {
      this.setState( prevState => {
      return {
            questionErrors: [
              ...prevState.questionErrors,
              'error'
            ]
        }
      })  
    }
  })
  if (this.state.cards.filter((card) => {
    return card.question === "" || card.question === undefined}).length > 0 ) {
      this.setState( prevState => {
        return {
              errors: [
                ...prevState.errors,
                'Questions cannot be left blank'
              ]
          }
        })  
    }        
}

validatedAnswers = () => {
  this.setState({answerErrors: []})
  this.state.cards.map((card, index) => {
    if (card.answer == "") {
      this.setState( prevState => {
      return {
            answerErrors: [
              ...prevState.answerErrors,
              'error'
            ]
        }
      })  
    }
  })
  if (this.state.cards.filter((card) => {
    return card.answer === "" || card.answer === undefined}).length > 0 ) {
      this.setState( prevState => {
        return {
              errors: [
                ...prevState.errors,
                'Answers cannot be left blank'
              ]
          }
        })  
    }  
}

handleDeckSubjectChange(event) {
    const value = event.target.value;
    this.setState(() => {
      return {
        subject: value,      
      };
    });
  }

handleCardQuestionChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, question: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleCardAnswerChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, answer: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleCardHintChange = idx => evt => {
    const newCards = this.state.cards.map((card, cidx) => {
      if (idx !== cidx) return card;
      return { ...card, hint: evt.target.value };
    });

    this.setState({ cards: newCards });
  };

  handleSubmit = evt => {
    const { question, answer, cards } = this.state;
    alert(`Created: ${question} ${answer} with ${cards.length} cards`);
  };

  handleAddCard = () => {
    this.setState({
      cards: this.state.cards.concat([{ question: "", answer: "", hint: "" }])
    });
  };

  handleRemoveCard = idx => () => {
    this.setState({
      cards: this.state.cards.filter((c, cidx) => idx !== cidx)
    });
  };


componentDidMount() {  
  // Make a call to the API to get all the decks in the DB.
  this.props.context.actions.getSubjects()
  // Get all available subjects
    .then(subjects=>{
      let arrayOfObjects = [];
      let subjectCheckboxArray = subjects.subject_list.forEach( (subject, i) => { 
        // For each subject returned from db, push to arrayOfObjects
        arrayOfObjects.push({name: subject.name, value:subject._id, key:i,})
      });
      this.setState({
        subjects: subjectCheckboxArray,
        checkboxes: arrayOfObjects,
        loading: false
      })

    }).catch((error)=>{
      // catch errors and push new route to History object
      this.props.history.push('/error');
    })
}

  render() {
    const {
      title,
      subject,
      errors,
      userId,
      user
    } = this.state;

    return (
      <div className="bounds deck--detail">
        <h1>Create Deck</h1>
        <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Deck"
            // elements prop is a function  which returns
            // the input fields to be used in each of the forms
            elements={() => (
              <React.Fragment>
            <div className="grid-66">
              <div className="deck--header">
                <div>
                  <label>
                    Deck Title
                    <input 
                      id="title" 
                      name="title" 
                      type="text" 
                      className={this.state.nameError}
                      onChange={this.change} 
                      placeholder="Deck title..." 
                      value={title}
                     />
                  </label>
                   <input 
                      id="user" 
                      name="user" 
                      type="hidden" 
                      className="input-title deck--title--input"                     
                      value={userId}
                     />  
                </div>
                {/* <p>By {user}</p> */}
              </div>
              {this.state.subjects}
              <React.Fragment>

            <label>
            Subject
              <select onChange={this.subjectChange} className={this.state.subjectError}>
              {
              this.state.checkboxes.map((deck, index) => (
                <option value={deck.value} key={index}>{deck.name}</option>
              ))
              }
            </select>
            </label>
      </React.Fragment>
            </div>

            <div className="cards">
        {this.state.cards.map((card, idx) => (
          <div className="card" key={idx+1}>
            <input
              type="text"
              placeholder={`Card #${idx + 1} question`}
              value={card.question}
              onChange={this.handleCardQuestionChange(idx)}
              className={this.state.questionErrors[idx]}
              // key={idx+1}
            />
            <input
              type="text"
              placeholder={`Card #${idx + 1} answer`}
              value={card.answer}
              onChange={this.handleCardAnswerChange(idx)}
              className={this.state.answerErrors[idx]}
              // key={idx+1}
            />
            <input
              type="text"
              placeholder={`Card #${idx + 1} hint`}
              value={card.hint}
              onChange={this.handleCardHintChange(idx)}
              // key={idx+1}
            />
            <button
              type="button"
              disabled={this.state.cards.length<2}
              onClick={this.handleRemoveCard(idx)}
              className="small"
              // key={idx+1}
            >
              - Remove Card
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={this.handleAddCard}
          className="small"
        >
          + Add Card
        </button>
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

  subjectChange = (event) => {
    // Any changes made in the input fields will update it's corresponding property in state
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        subject: value,      
      };
    });
  }

  submit = () => {
    
    this.setState({errors:[]})
    // Data is passed to the component via a prop named context. 
    // Destructuring is used to extract the value from props. 
    const { context } = this.props;

    // unpack the name, username and password properties from 
    // the state object (this.state) into distinct variables
    const {
      title,
      userId,
      subject,
      cards
    } = this.state;

    this.setState({ preservedTitle: title, userId: userId });
    
    // Initialize a variable named deckPayload to an object 
    // containing the necessary data to make a call to the API to create a deck
    const deckPayload = {
        title: title,
        user: userId,
        // convert checkedItemsIds map object into an array containing subject ids
        // filter any items that are undefined
        subject: [subject],
        cards: cards
    }

    

    // Store the users credentials in an object so it can be passed along to the API to authenticate the user
    const credentials = this.props.context.authenticatedUser.user.token;

    // Create deck by calling the create method made available through Context
    // The deck data and users credentials are passed along.
    console.log(deckPayload)

    console.log(this.state.errors.length)


    // if (this.state.errors.length > 0) {
    //   console.log(this.state.errors.length)
    //   return;
    // } else {

    if (this.errorsExist()) {
      this.validatedName()
      this.validatedSubject()
      this.validatedQuestions()
      this.validatedAnswers()
      // if (this.state.questionErrors.length > 0) {
      //   this.setState( prevState => {
      //     return {
      //             errors: [
      //               ...prevState.errors,
      //               'Question field cannot be left blank'
      //             ],
      //       }
      //     })
      // }
      // if (this.state.answerErrors.length > 0) {
      //   this.setState( prevState => {
      //     return {
      //             errors: [
      //               ...prevState.errors,
      //               'Answer field cannot be left blank'
      //             ],
      //       }
      //     })
      // }
    } else {
      context.data.createDeckWithCards(deckPayload, credentials)
      .then((response) => {
        // If API returns a response that is not 201, set the errors property in state to the response. 
        // The response will carry any error messages in an array. The title and description are then initialized.
        if (response.status !== 201) {
          this.setState({ errors: response });
          this.setState({title: this.state.preservedTitle})
        } else {
          // response.headers.get('Location');
          // The errors property is set to the response, which should be empty. The user is sent to the decks list.
          this.setState({ errors: [] });
          this.setState({title: title});
          this.props.history.push(`/decks/` + response.id);
          return response
        }
      })
      .catch((error) => {
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }
}

    cancel = () => {
      // access the history object via props, and push the error route
      this.props.history.push('/');
    }
}