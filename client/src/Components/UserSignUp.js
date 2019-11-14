import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

// The UserSignIn component is a component "with context", 
// meaning it's subscribed to the application context – 
// the data is passed to the component via a context prop.

export default class UserSignUp extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      username,
      email,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="sign-in-up centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>   
                <input 
                  id="username" 
                  name="username" 
                  type="text"
                  value={username} 
                  onChange={this.change} 
                  placeholder="Username" />
                <input 
                  id="email" 
                  name="email" 
                  type="text"
                  value={email} 
                  onChange={this.change} 
                  placeholder="Email" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />         
              </React.Fragment>
            )} />        
        </div>      
        <div className="grid-33 centered signin new">
            <p className="test">
            Don't have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
          </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    // {/* initialize context variable containing the context props  */}
    const { context } = this.props;
    // unpack username and properties password from state
    const { username, email, password } = this.state;

    const user = {username, email, password}

    // call the signIn() function, passing in the users credentials
    // signIn returns the users credentials or null if invalid 
    context.data.createUser(user)
      .then((errors) => {
        // if (user === null) {
        //   this.setState(() => {
        //     return { errors: [ 'Sign-in was unsuccessful' ] };
        //   });
        if (errors.length) {
          console.log(errors)
          // if any error messages, set the error state to the value of the errors
          this.setState({ errors })
        } else {
          context.actions.signIn(username, password)
            .then((errors) => {
              console.log(errors)
              if (errors.length) {
              // if any error messages, set the error state to the value of the errors
              this.setState({ errors })
              } else {
                console.log('here')
                this.props.history.push('/decks');
                console.log(`SUCCESS! ${username} is now signed in!`);
              }
            })
            .catch((err) => {
              console.log(err)
              // catch errors and push new route to History object
              this.props.history.push('/error');
            });
          }
        })
      .catch((err) => {
        console.log(err)
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }

  cancel = () => {
    this.props.history.push('/');
  }
}

