import React, { Component } from 'react';
import axios from 'axios';

import {
  Route,
  Switch
} from 'react-router-dom';
import DeckContainer from './DeckContainer'

/* 
This stateful component retreives all the decks in the database once the component mounts. 
A decks property is set in state with a value of the retrived decks list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class Decks extends Component {
// Constructor initializes state //

  constructor(props) {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      decks: [],
      loading: true
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the decks in the DB.
    axios('http://localhost:5000/catalog/decks')
        .then(decks => {
            this.setState({
                decks: decks.data.deck_list,
                loading: false
              })
        }).catch(()=>{
            // catch errors and push new route to History object
            this.props.history.push('/error');
          })
  }

  render() {

    return (         
      <div className="course-list-container">
      <Switch>
      {/* Ternary operator determined whether to display loading message or render CourseContainer Component */}
      {
        (this.state.loading)
        ? <Route exact path="/decks" render= {() => <p>Loading...</p>  } />
        : <Route exact path="/decks" render= {()=><DeckContainer data={this.state.decks}/> } />
      } 
      </Switch>
      {/* The NewCourseLink is set outside Switch so that it will always render even if no decks are available */}
      {/* <Route exact path="/decks/" render= {() => <NewCourseLink />} />
        <div className="main-content">
        </div>   */}
      </div>
    );
  }
}