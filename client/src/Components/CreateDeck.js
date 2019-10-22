import React, { Component } from 'react';
import Form from './Form';

/* 
UpdateCourse - This component provides the "Update Course" screen by 
rendering a form that allows a user to update one of their existing courses. 
The component also renders an "Update Course" button that when clicked sends 
a PUT request to the REST API's /api/courses/:id route. 
This component also renders a "Cancel" button that returns the user to 
the "Course Detail" screen. 
*/

/* pass props to UpdateCourse Component from Course */

export default class CreateDeckWithContext extends Component {

  constructor(props) {
    super();
  this.state= {
  preservedTitle: '',
  title: '',      
  subjects: [],           
  subjectsChecked: [],           
  errors: [],
  searchText: '',
  user: props.context.authenticatedUser.user.user.name,
  userId: props.context.authenticatedUser.user.user.id,
  };
}

componentDidMount() {  
  // Make a call to the API to get all the courses in the DB.
  this.props.context.actions.getSubjects()
  // Get all available subjects
    .then(subjects=>{
      let subjectCheckboxArray = subjects.subject_list.map( (subject) => { 
        // For each deck received in props, return a Deck component with relevant data
        return <label key={subject._id}>{subject.name}<input onChange={this.change} type="checkbox" name="subject" id={subject._id} value={subject._id} checked={subject.checked} key={subject._id}/></label>
        // return <Deck title={result.title} id={result._id} key={result._id}/>
      });
      this.setState({
        subjects: subjectCheckboxArray,
        loading: false
      })

    }).catch((error)=>{
      console.log(error)
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

    // this.state.subjects.forEach( (subject) => { 
    //   this.setState({
    //     [subject]: {subject}
    //   })

    // let subjects = this.state.subjects.map( (subject) => { 
    //   // For each deck received in props, return a Deck component with relevant data
    //   return <label key={subject._id}>{subject.name}<input onChange={this.change} type="checkbox" name="subject" id={subject._id} value={subject._id} checked={subject.checked} key={subject._id}/></label>
    //   // return <Deck title={result.title} id={result._id} key={result._id}/>
    // });

    return (
      <div className="bounds course--detail">
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
              <div className="course--header">
                <h4 className="course--label">Deck</h4>
                <div>
                  <input 
                    id="title" 
                    name="title" 
                    type="text" 
                    className="input-title course--title--input" 
                    onChange={this.change} 
                    placeholder="Deck title..." 
                    value={title}
                     />
                   <input 
                    id="user" 
                    name="user" 
                    type="hidden" 
                    className="input-title course--title--input"                     
                    value={userId}
                     />  
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
    const testing = event.target.checked

    this.setState(() => {
      return {
        [name]: value,
        testing       
      };
    });
  }

  submit = () => {

    console.log(this.state.subjects)
    // console.log(res.subject)
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
    
    // Initialize a variable named coursePayLoad to an object 
    // containing the necessary data to make a call to the API to create a course
    // const coursePayload = {
    //   title,
    //   userId
    // };

    const deckPayload = {
      title: title,
      user: userId,
      subject: this.state.subject
    }

    // Store the users credentials in an object so it can be passed along to the API to authenticate the user
    const credentials = this.props.context.authenticatedUser.user.token;

    // Create user by calling the create method made available through Context
    // The course data and users credentials are passed along.
    context.data.create(deckPayload, credentials)
    .then((response) => {
      // If API returns a response that is not 201, set the errors property in state to the response. 
      // The response will carry any error messages in an array. The title and description are then initialized.
      // sometimes this condition is true when validation fails.
      // It's also true when a successful post happen because status isn't
      // being set properly
      if (response.status !== 201) {
        console.log(response)
        // currently a successful response is returning the new id
        // change it so there's a response.status
        // this.props.history.push(`/decks/` + response);
        this.setState({ errors: response });
        this.setState({title: this.state.preservedTitle})
      } else {
        // response.headers.get('Location');
        // The errors property is set to the response, which should be empty. The user is sent to the courses list.
        this.setState({ errors: [] });
        this.setState({title: title});
        this.props.history.push(`/decks/` + response.id);
        return response
        // this.setState({title: title});
        // this.props.history.push(`/decks/` + response);
        // this.props.history.push(`/decks/create`);
        // return response
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