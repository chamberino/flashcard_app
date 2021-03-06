import React, { Component } from 'react';

import { Route, Switch, Link } from 'react-router-dom';
import DeckContainer from '../Decks/DeckContainer';

/* 
This stateful component retreives all the decks in the database once the component mounts. 
A decks property is set in state with a value of the retrived decks list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class SubjectDetail extends Component {
// Constructor initializes state //

  constructor() {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      decks: [],
      loading: true,
      // credentials: props.context.authenticatedUser.user.token
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the decks in the DB.
    this.props.context.actions.getSubjectDecks(this.props.match.params.id)
    // Set value of returned decks to the decks property in state. Change loading property to false.
      .then(decks=>{
        this.setState({
          subject: decks.subject.name,
          decks: decks.subject_decks,
          loading: false
        });
      }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
  }

  render() {

    return (         
      <div className="deck-list-container">
        <Switch>
        {/* Ternary operator determined whether to display loading message or render DeckContainer Component */}
        {
          (this.state.loading)
          ? <Route exact path="/subject/:id" render= {() => <p>Loading...</p>  } />
          : <React.Fragment>
              <h2>{`${this.state.subject} Decks`}</h2>
              <Route exact path="/subject/:id" render= {()=><DeckContainer data={this.state.decks}/> } />
              <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <Link className="button button-secondary" to="/decks">Return to All Decks</Link>
                        <Link className="button button-secondary" to="/subjects">Return to Subjects</Link>
                    </div>
                </div>
              </div>
            </React.Fragment>
        } 
        </Switch>
      {/* The NewDeckLink is set outside Switch so that it will always render even if no decks are available */}
      {/* <Route exact path="/decks/" render= {() => <NewDeckLink />} />
        <div className="main-content">
        </div>   */}
      </div>
    );
  }
}