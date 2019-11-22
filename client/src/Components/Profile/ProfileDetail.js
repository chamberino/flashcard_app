import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';
import DeckContainer from '../Decks/DeckContainer';
import NewDeckLink from '../NewDeckLink';

/* 
This stateful component retreives all the decks in the database once the component mounts. 
A decks property is set in state with a value of the retrived decks list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class ProfileDetail extends Component {
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
    this.props.context.actions.getUserDecks(this.props.context.authenticatedUser.user.user.id)
    // Set value of returned decks to the decks property in state. Change loading property to false.
      .then(decks=>{
        if (decks.errorStatus || decks.message) {
          this.props.history.push(`/notfound`);
          return null; 
        } else {
          this.setState({
            name: decks.userName,
            decks: decks.user_decks,
            loading: false
          })
        }
      }).catch(()=>{
        // catch errors and push new route to History object
        this.props.history.push('/error');
      });
      
  }

  render() {

    return (         
      <div className="deck-list-container main-content">
        <Switch>
        {/* Ternary operator determined whether to display loading message or render DeckContainer Component */}
        {
          (this.state.loading)
          ? <Route exact path="/profile/:id" render= {() => <p>Loading...</p>  } />
          : <React.Fragment>
            <div className="user-profile">
              <div className="profile-picture">
                <svg className="svg-icon-profile" viewBox="0 0 20 20">
							    <path d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
						    </svg>
              </div>
              <h2>{`${this.state.name}`}</h2>
            </div>
              <Route exact path="/profile" render= {()=><DeckContainer data={this.state.decks}/> } />
              <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <NewDeckLink />
                        {/* <Link className="button button-secondary" to="/decks">Return to List</Link> */}
                        <div className="empty"></div>
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