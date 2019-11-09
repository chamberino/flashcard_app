import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

// The UserSignIn component is a component "with context", 
// meaning it's subscribed to the application context – 
// the data is passed to the component via a context prop.

export default class UserSignIn extends Component {

  state = {
    email: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      email,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        {/* <div className="sign-in-up centered signin"> */}
        <div className="section-title">
          <h1>Sign In</h1>
        </div>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            formButtonsClass="form-buttons-login"
            elements={() => (
              <React.Fragment>
                <div className="signup-login-input-container">
                  <input 
                    id="email" 
                    className="signup-login-input"
                    name="email" 
                    type="email"
                    value={email} 
                    onChange={this.change} 
                    placeholder="Email" />
                  <input 
                    id="password" 
                    className="signup-login-input"
                    name="password"
                    type="password"
                    value={password} 
                    onChange={this.change} 
                    placeholder="Password" />  
                </div>              
              </React.Fragment>
            )} />        
        {/* </div>       */}
        <div className="centered signup-banner">
            <p>
            Don't have a user account? <Link to="/signup"><strong>Click here</strong></Link> to sign up!
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
    // The from variable passed to history.push(from) contains information 
    // about the pathname an unauthenticated user redirected from (via this.props.location.state). 
    const { from } = this.props.location.state || { from: { pathname: '/decks' } };
    // unpack username and properties password from state
    const { email, password } = this.state;

    // call the signIn() function, passing in the users credentials
    // signIn returns the users credentials or null if invalid 
    context.actions.signIn(email, password)
      .then((errors) => {
        // if (user === null) {
        //   this.setState(() => {
        //     return { errors: [ 'Sign-in was unsuccessful' ] };
        //   });
        if (errors.length) {
          // if any error messages, set the error state to the value of the errors
          this.setState({ errors })
        } else {
          this.props.history.push(from);
          console.log(`SUCCESS! ${email} is now signed in!`);
        }
      })
      .catch((err) => {
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }

  cancel = () => {
    this.props.history.push('/');
  }
}

