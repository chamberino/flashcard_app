import React, { Component } from 'react';
import Form from './Form';

// The UserSignIn component is a component "with context", 
// meaning it's subscribed to the application context – 
// the data is passed to the component via a context prop.

export default class UserSignUp extends Component {

  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    errors: [],
    serverErrors: [],
    emailError: {styling: '', message:''},
    passwordError: {styling: '', message:''},
  }

  errorsExist = () => {
    if 
    (this.state.email.length < 1 || this.state.password.length < 1) 
      {return true}
  }

  validatedEmail = () => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (this.state.email.length < 1 || !emailRegEx.test(this.state.email)) {
      this.setState( prevState => {
      return {
              errors: [
                ...prevState.errors,
                'Please enter valid email'
              ],
              emailError: {styling: "error", message: "Please enter a valid email"}
        }
      })
    } else {
      return null
    }
  }

  validatedPassword = () => {
    if (this.state.password.length < 1) {
      this.setState( prevState => {
      return {
              errors: [
                ...prevState.errors,
                'Password required'
              ],
              passwordError: {styling: "error", message: "Password required"}
        }
      })
    } else {
      return null
    }
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="section-title">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            formButtonsClass="form-buttons-login"
            elements={() => (
              <React.Fragment>
                <div className="signup-login-input-container"></div>
                <textarea 
                    id="first_name" 
                    maxLength="50"                  
                    name="first_name" 
                    type="text"
                    value={first_name} 
                    onChange={this.change} 
                    placeholder="First Name" />
                  <textarea 
                    id="last_name" 
                    maxLength="50"                  
                    name="last_name" 
                    type="text"
                    value={last_name} 
                    onChange={this.change} 
                    placeholder="Last Name" />   
                  <textarea
                    id="email" 
                    maxLength="50" 
                    className={this.state.emailError.styling}                  
                    name="email" 
                    type="email"
                    value={email} 
                    onChange={this.change} 
                    placeholder="Email" />
                    {(!(this.state.emailError.message === ""))
                        ? <div className="errorMessage">{this.state.emailError.message}</div> 
                        : <div className="errorMessage">&nbsp;&nbsp;</div> 
                    }
                  <input 
                    id="password" 
                    className={this.state.emailError.styling}
                    name="password"
                    type="password"
                    value={password} 
                    onChange={this.change} 
                    placeholder="Password" /> 
                    {(!(this.state.passwordError.message === ""))
                        ? <div className="errorMessage">{this.state.passwordError.message}</div> 
                        : <div className="errorMessage">&nbsp;&nbsp;</div> 
                    }             
                    <div className="errorMessage">{this.state.serverErrors}</div>   
                </React.Fragment>
            )} />        
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
    this.setState({errors:[], emailError: {styling: '', message:''}, passwordError: {styling: '', message:''}})
    // {/* initialize context variable containing the context props  */}
    const { context } = this.props;
    // unpack username and properties password from state
    const { first_name, last_name, email, password } = this.state;

    const user = {first_name, last_name, email, password}

    if (this.errorsExist()) {
      // window.scrollTo({ top: 0, behavior: 'smooth' })
      this.validatedEmail();
      this.validatedPassword();
    } else {

    // call the signIn() function, passing in the users credentials
    // signIn returns the users credentials or null if invalid 
    context.data.createUser(user)
      .then((errors) => {
        // if (user === null) {
        //   this.setState(() => {
        //     return { errors: [ 'Sign-in was unsuccessful' ] };
        //   });
        if (errors.length) {
          // if any error messages, set the error state to the value of the errors
          this.setState({ errors })
        } else {
          context.actions.signIn(email, password)
            .then((errors) => {
              if (errors.length) {
              // if any error messages, set the error state to the value of the errors
              this.setState({ serverErrors: errors })
              } else {
                this.props.history.push('/decks');
                console.log(`SUCCESS! ${email} is now signed in!`);
              }
            })
            .catch((err) => {
              // catch errors and push new route to History object
              this.props.history.push('/error');
            });
          }
        })
      .catch((err) => {
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
    };
  };

  cancel = () => {
    this.props.history.push('/');
  }
}

