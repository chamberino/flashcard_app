import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SubjectContainer from './SubjectContainer';

/* 
This stateful component retreives all the subjects in the database once the component mounts. 
A subjects property is set in state with a value of the retrived subjects list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class Subjects extends Component {
// Constructor initializes state //

  constructor() {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      subjects: [],
      loading: true,
      // credentials: props.context.authenticatedUser.user.token
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the courses in the DB.
    this.props.context.actions.getSubjects()
    // Set value of returned courses to the courses property in state. Change loading property to false.
      .then(subjects=>{
        this.setState({
          subjects: subjects.subject_list,
          loading: false
        });
      }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }

  render() {

    return (         
      <div className="subject-list-container">
      <Switch>
      {/* Ternary operator determined whether to display loading message or render subjectContainer Component */}
      {
        (this.state.loading)
        ? <Route exact path="/subjects" render= {() => <p>Loading...</p>  } />
        : <Route exact path="/subjects" render= {()=><SubjectContainer data={this.state.subjects}/> } />
      } 
      </Switch>
      {/* The NewSubjectLink is set outside Switch so that it will always render even if no users are available */}
      {/* <Route exact path="/users/" render= {() => <NewSubjectLink />} /> */}
        <div className="main-content">
        </div>  
      </div>
    );
  }
}