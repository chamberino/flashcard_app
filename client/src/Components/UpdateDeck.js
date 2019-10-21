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

export default class UpdateDeck extends Component {

    constructor(props) {
        super();
      this.state= {
      preservedTitle: '',
      preservedDescription: '',  
      title: '',    
      description: '',                
      estimatedTime: '',
      materialsNeeded: '',
      errors: [],
      searchText: '',
      user: props.context.authenticatedUser.user.fullName
      };
    }
    
      render() {
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          errors,
          user
        } = this.state;
    
        return (
          <div className="bounds course--detail">
            <h1>Update Deck</h1>
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
                        placeholder="Course title..." 
                        value={title}
                         />
                    </div>
                    <p>By {user}</p>
                  </div>
                  <div className="course--description">
                    <div>
                      <textarea 
                        id="description" 
                        name="description" 
                        className="" 
                        placeholder="Course description..." 
                        value={description}
                        onChange={this.change} 
                        />
                      </div>
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div>
                          <input 
                            id="estimatedTime" 
                            name="estimatedTime" 
                            type="text" 
                            className="course--time--input" 
                            onChange={this.change} 
                            placeholder="Hours" 
                            value={estimatedTime} />
                        </div>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div>
                          <textarea 
                            id="materialsNeeded" 
                            name="materialsNeeded" 
                            placeholder="List materials..." 
                            onChange={this.change} 
                            value={materialsNeeded}
                            />
                        </div>
                      </li>
                    </ul>
                  </div>
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
            [name]: value
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
          title,
          description,
          estimatedTime,
          materialsNeeded,
        } = this.state;
    
        this.setState({ preservedTitle: title, preservedDescription: description });
        
        // Initialize a variable named coursePayLoad to an object 
        // containing the necessary data to make a call to the API to create a course
        const coursePayload = {
          title,
          description,
          estimatedTime,
          materialsNeeded,
        };
    
        // Store the users credentials in an object so it can be passed along to the API to authenticate the user
        const credentials = {
          emailAddress: this.props.context.authenticatedUser.user.emailAddress,
          password: this.props.context.authenticatedUser.password
        }
    
        // Create user by calling the create method made available through Context
        // The course data and users credentials are passed along.
        context.data.create(coursePayload, credentials)
        .then((response) => {
          // If API returns a response that is not 201, set the errors property in state to the response. 
          // The response will carry any error messages in an array. The title and description are then initialized.
          if (response.status !== 201) {
            this.setState({ errors: response });
            this.setState({title: this.state.preservedTitle, description: this.state.preservedDescription})
          } else {
            console.log(response.course);
            console.log('test')
            // The errors property is set to the response, which should be empty. The user is sent to the courses list.
            this.setState({ errors: response });
            this.setState({title: title, description: description, estimatedTime: estimatedTime, materialsNeeded: materialsNeeded});
            this.props.history.push(`/courses/`);
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