import React, { Component } from 'react';
import axios from 'axios';

/* 
This stateful component retreives all the courses in the database once the component mounts. 
A courses property is set in state with a value of the retrived courses list.

Until the data is retreived and the component is successfully rendered, a loading state property is set to true
As long as this property is set to true, a loading message will be rendered. 
*/

export default class Courses extends Component {
// Constructor initializes state //

  constructor(props) {
  // Super allows us to use the keyword 'this' inside the constructor within the context of the app class
    super();
    this.state= {
      cards: [],
      loading: true
    };
  }

  componentDidMount() {
    // Make a call to the API to get all the courses in the DB.
    axios('http://localhost:5000/catalog/deck/5d9d56f55ab0948fcaf495ad')
        .then(cards => {
            this.setState({
                cards: cards.data.cards[2].answer,
                loading: false
              })
        }).catch(()=>{
            // catch errors and push new route to History object
            this.props.history.push('/error');
          })
  }

  render() {

    return (         
        <h1>{this.state.cards}</h1>
    );
  }
}