import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import UserContainer from './UserContainer';

/* 
This stateful component retreives all the users in the database once the component mounts. 
A users property is set in state with a value of the retrived users list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class Users extends Component {
// Constructor initializes state //

  constructor() {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      users: [],
      loading: true,
      // credentials: props.context.authenticatedUser.user.token
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the users in the DB.
    this.props.context.actions.getUsers()
    // Set value of returned users to the users property in state. Change loading property to false.
      .then(users=>{
        this.setState({
          users: users.user_list,
          loading: false
        });
      }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }

  render() {

    return (         
      <div className="user-list-container">
      <Switch>
      {/* Ternary operator determined whether to display loading message or render userContainer Component */}
      {
        (this.state.loading)
        ? <Route exact path="/users" render= {() => <p>Loading...</p>  } />
        : <Route exact path="/users" render= {()=><UserContainer data={this.state.users}/> } />
      } 
      </Switch>
      {/* The NewUserLink is set outside Switch so that it will always render even if no users are available */}
      {/* <Route exact path="/users/" render= {() => <NewUserLink />} /> */}
        <div className="main-content">
        </div>  
      </div>
    );
  }
}