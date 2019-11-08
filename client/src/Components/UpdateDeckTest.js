import React, { Component } from 'react';
import Form from './Form';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

export default class UpdateDeckTestWithContext extends Component {

constructor(props) {
    super(props);
        this.state= {
            loading: true, 
            deleteCard: props.context.actions.deleteCard, 
            deckId: props.match.params.id,  
            cards: [],
            subjects: [],
            subjectsArray: [],
            select: [],
            subject: '',
            preservedTitle: '',
            title: '',      
            subjectsChecked: [],           
            errors: [],
            searchText: '',
            nameError: {styling: '', message:''},
            subjectError: {styling: '', message:''},
            questionErrors: [],
            answerErrors: [],
            user: props.context.authenticatedUser.user.user.name,
            userId: props.context.authenticatedUser.user.user.id,
            credentials: props.context.authenticatedUser.user.token,
            deleteClass: 'svg-icon-disable',
    };
}

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
            nameError: {styling: "error", message: "Please enter a valid title"}
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
            subjectError: {styling: 'error', message:'Please choose a subject'}   
      }
    })
  }
}

validatedQuestions = () => {
  this.setState({questionErrors: []})
  this.state.cards.map((card) => {
    if (card.question === "") {
      this.setState( prevState => {
        return {
          questionErrors: [
            ...prevState.questionErrors,
            {styling: 'error', message:'Questions cannot be left blank'}
          ]
      }
      })  
    } else {
      this.setState( prevState => {
        return {
              questionErrors: [
                ...prevState.questionErrors,
                {styling: '', message:''}
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
    if (card.answer === "") {
      this.setState( prevState => {
      return {
            answerErrors: [
              ...prevState.answerErrors,
              {styling: 'error', message:'Answers cannot be left blank'}
            ]
        }
      })  
    } else {
      this.setState( prevState => {
        return {
              answerErrors: [
                ...prevState.answerErrors,
                {styling: '', message:''}
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
      this.setState( prevState => {
        if (prevState.cards.length >= 2) {
        return { deleteClass: 'svg-icon'}
        }
      });
    this.setState({
      cards: this.state.cards.concat([{ question: "", answer: "", hint: "" }])
    });
    this.setState( prevState => {
      return {
            answerErrors: [
              ...prevState.answerErrors,
              {styling: '', message:''}
            ],
            questionErrors: [
              ...prevState.questionErrors,
              {styling: '', message:''}
            ]
        }
      })  
  };

  handleRemoveCard = (idx, cardId, credentials) => () => {
    if (this.state.cards.length > 2) {
      this.setState({
        cards: this.state.cards.filter((c, cidx) => idx !== cidx)
      });
    }
    this.setState( prevState => {
      if (prevState.cards.length <= 2) {
      return { deleteClass: 'svg-icon-disable'}
      }
    });
    if (cardId !== undefined) {
    this.deleteCard(cardId, credentials)
        .then((card) => {         
            this.setState({
              deletedCardOrError: card,
            })
            this.props.history.push(`/decks/${this.state.deckId}/updatedecktest`);
        }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
        })
    }
  };

  deleteCard = async (cardId, credentials) => {    
    await this.state.deleteCard(cardId, credentials)
  }


componentDidMount() {  
    // Make a call to the API to get all the decks in the DB.
    this.props.context.actions.getDeck(this.state.deckId)
    .then((deck)=>{
        if (deck.errorStatus || deck.message) {
            this.props.history.push(`/notfound`);
            return null
        } else if (this.state.userId !== deck.deck.user._id) {
            this.props.history.push(`/forbidden`);
            return null;
        } else {
            if(deck.cards.length>2){
                this.setState({
                    deleteClass: 'svg-icon',
                })
            }
            deck.cards.map((card)=>{
                this.setState( prevState => {
                    return {
                      cards: [
                        ...prevState.cards,
                        { question: card.question, answer: card.answer , hint: card.hint, id: card._id}
                      ],
                      questionErrors: [
                        ...prevState.questionErrors,  
                        {styling: '', message:''}
                      ],
                      answerErrors: [
                        ...prevState.answerErrors,  
                        {styling: '', message:''}
                      ]

                  }
                  }) 
            })
            this.setState({
            deck: deck,
            subject:deck.deck.subject[0]._id,
            deckCreatorId: deck.deck.user._id,
            deckCreator: `${deck.deck.user.first_name} ${deck.deck.user.last_name}`,
            foundDeck: true,
            title: deck.title,
            deckId: deck.deck._id,
            })
        }
    }).then((deck)=>{     
        this.props.context.actions.getSubjects()
  // Get all available subjects
    .then(subjects=>{
      let arrayOfObjects = [];
      let subjectsArray = [];
      subjects.subject_list.forEach( (subject, i) => { 
        // For each subject returned from db, push to arrayOfObjects
        arrayOfObjects.push({name: subject.name, value:subject._id, key:i,})
        subjectsArray.push({label: subject.name, value: subject._id})
      });
      this.setState({
        subjects: arrayOfObjects,
        subjectsArray: subjectsArray,
        loading: false
      })

    }).catch((error)=>{
      // catch errors and push new route to History object
      this.props.history.push('/error');
    })
    }).catch((error)=>{
            // catch errors and push new route to History object
        this.props.history.push('/error');
    })

  // Make a call to the API to get all the decks in the DB.
}

  render() {
    const {
      title,
      errors,
      userId,
      deckCreator
    } = this.state;

    return (
        (this.state.loading) 
        ? null
        :      
        <div className="bounds deck--detail">
            <h1 className="title">Update deck</h1>
            <button
                type="button"
                onClick={this.submit}
                className="button create"
            >Update
            </button>
            <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update Deck"
            // elements prop is a function  which returns
            // the input fields to be used in each of the forms
            elements={() => (
                <React.Fragment>
                <div className="grid-66">
                <div className="deck--header">
                    <div>                    
                        <label>   
                        <div className="textArea">
                            <textarea 
                            maxLength="255"
                            id="title" 
                            name="title" 
                            type="text" 
                            className={this.state.nameError.styling}
                            onChange={this.change} 
                            placeholder="Subject, chapter, unit" 
                            value={title}
                            />
                        </div>
                        Title
                        </label>
                    <div className="errorMessage">{this.state.nameError.message}</div>
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
                </div>
                <Dropdown options={this.state.subjectsArray} value={this.state.subject} placeholder="this.state.subject" onChange={this.subjectChange}  className="dropdown"/ >  
            <div className="deck--header2"><div className="errorMessage">{this.state.subjectError.message}</div></div>
                <div className="cards">
            {this.state.cards.map((card, idx) => (
            <div className="card" key={idx+1}>
            <label>
                <textarea 
                    maxLength="255"
                    type="text"
                    placeholder={`Enter term`}
                    value={card.question}
                    onChange={this.handleCardQuestionChange(idx)}
                    className={this.state.questionErrors[idx].styling}                
                    // key={idx+1}
                />
                Term
                </label>
                <div className="errorMessage">{this.state.questionErrors[idx].message}</div>
                <label>
                <textarea 
                maxLength="255"          
                type="text"
                placeholder={`Enter definition`}
                value={card.answer}
                onChange={this.handleCardAnswerChange(idx)}
                className={this.state.answerErrors[idx].styling}
                // key={idx+1}
                />
                Definition
                </label>
                <div className="errorMessage">{this.state.answerErrors[idx].message}</div>
                <label>
                <textarea 
                maxLength="255"
                type="text"
                placeholder={`Enter hint`}
                value={card.hint}
                onChange={this.handleCardHintChange(idx)}
                // key={idx+1}
                />
                Hint
                </label>
                <button
                type="button"
                disabled={this.state.cards.length<=2}
                onClick={this.handleRemoveCard(idx, this.state.cards[idx].id, this.state.credentials)}
                className="remove-card"
                // key={idx+1}
                >
                <svg className={this.state.deleteClass}  viewBox="0 0 20 20">
                                <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
                            </svg>
                </button>
            </div>
            ))}
            
            <button
            type="button"
            onClick={this.handleAddCard}
            className="add-card"
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
    const value = event.value;
    this.setState(() => {
      return {
        subject: value,      
      };
    });
  }

  submit = () => {
    this.setState({errors:[], nameError: {styling: '', message:''}, subjectError: {styling: '', message:''}})
    // Data is passed to the component via a prop named context. 
    // Destructuring is used to extract the value from props. 
    const { context } = this.props;

    // unpack the name, username and password properties from 
    // the state object (this.state) into distinct variables
    const {
      title,
      userId,
      subject,
      cards,
      deckId
    } = this.state;

    this.setState({ preservedTitle: title, userId: userId });
    
    // Initialize a variable named deckPayload to an object 
    // containing the necessary data to make a call to the API to create a deck
    const deckPayload = {
        title: title,
        user: userId,
        deckId: deckId,
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

    // errorsExist returns a boolean depending on if there are any input errors
    // If true, individual validation functions run and update 'errors' in state so they
    // can be passed to the form component, mapped over, and outputted to the user. 
    if (this.errorsExist()) {
      console.log(this.errorsExist(), this.state.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      this.validatedName()
      this.validatedSubject()
      this.validatedQuestions()
      this.validatedAnswers()
    } else {
      context.data.updateDeckWithCards(`/deck/${this.state.deckId}/updatedeckwithcards`, deckPayload, credentials)
      .then((response) => {
        console.log(response)
        // If API returns a response that is not 201, set the errors property in state to the response. 
        // The response will carry any error messages in an array. The title and description are then initialized.
        if (response.status !== 204) {
          console.log(response.status)
          this.setState({ errors: response });
          this.setState({title: this.state.preservedTitle})
        } else {
          // response.headers.get('Location');
          // The errors property is set to the response, which should be empty. The user is sent to the decks list.
          {/* this.setState({ errors: [] }); */}
          console.log('here')
          this.props.history.push(`/decks/` + deckId);
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