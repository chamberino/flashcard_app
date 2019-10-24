import React, { Component } from 'react';
import Checkbox from './Checkbox';
import Form from './Form';

export default class CreateDeckWithContext extends Component {

  constructor(props) {
    super(props);
  this.state= {
  checkboxes: [],
  checkedItems: new Map(),
  checkedItemsIds: new Map(),
  preservedTitle: '',
  title: '',      
  subjects: [],           
  subjectsChecked: [],           
  errors: [],
  searchText: '',
  user: props.context.authenticatedUser.user.user.name,
  userId: props.context.authenticatedUser.user.user.id,
  };

  this.handleChange = this.handleChange.bind(this);
}

handleChange(e) {
  const label =e.target.value;
  const item = e.target.name;
  const isChecked = e.target.checked;
  this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked), checkedItemsIds: prevState.checkedItemsIds.set(label, isChecked) }));
}


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
                <h4 className="deck--label">Deck</h4>
                <div>
                  <input 
                    id="title" 
                    name="title" 
                    type="text" 
                    className="input-title deck--title--input" 
                    onChange={this.change} 
                    placeholder="Deck title..." 
                    value={title}
                     />
                   <input 
                    id="user" 
                    name="user" 
                    type="hidden" 
                    className="input-title deck--title--input"                     
                    value={userId}
                     />  
                </div>
                <p>By {user}</p>
              </div>
              {this.state.subjects}
            </div>
        </React.Fragment>
          )} />
          <React.Fragment>
        {
          this.state.checkboxes.map(deck => (
            <label key={deck.key}>
              {deck.name}
              <Checkbox name={deck.name} value={deck.value} checked={this.state.checkedItems.get(deck.name)} onChange={this.handleChange} />
            </label>
          ))
        }
      </React.Fragment>
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

    // convert checkedItems map object into an array containing subject ids
    Array.from(this.state.checkedItemsIds, ([key, value]) => {
      if (value) {
      return key
      }
    }).filter((subject)=> (subject!==undefined))
    // Data is passed to the component via a prop named context. 
    // Destructuring is used to extract the value from props. 
    const { context } = this.props;

    // unpack the name, username and password properties from 
    // the state object (this.state) into distinct variables
    const {
      title,
      userId
    } = this.state;

    this.setState({ preservedTitle: title, userId: userId });
    
    // Initialize a variable named deckPayload to an object 
    // containing the necessary data to make a call to the API to create a deck
    const deckPayload = {
      title: title,
      user: userId,
      // convert checkedItemsIds map object into an array containing subject ids
      // filter any items that are undefined
      subject: Array.from(this.state.checkedItemsIds, ([key, value]) => {
        if (value) {
        return key
        }
      }).filter((subject)=> (subject!==undefined))
    }
    console.log(deckPayload);

    

    // Store the users credentials in an object so it can be passed along to the API to authenticate the user
    const credentials = this.props.context.authenticatedUser.user.token;
    console.log(credentials);

    // Create deck by calling the create method made available through Context
    // The deck data and users credentials are passed along.
    context.data.create(deckPayload, credentials)
    .then((response) => {
      // If API returns a response that is not 201, set the errors property in state to the response. 
      // The response will carry any error messages in an array. The title and description are then initialized.
      if (response.status !== 201) {
        this.setState({ errors: response });
        this.setState({title: this.state.preservedTitle})
      } else {
        // response.headers.get('Location');
        // The errors property is set to the response, which should be empty. The user is sent to the courses list.
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

  cancel = () => {
    // access the history object via props, and push the error route
    this.props.history.push('/');
  }
}