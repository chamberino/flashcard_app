import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    // if a an 'authenticatedUser' cookie exists, then state is set to it's value
    // Otherwise the value of authenticatedUser is null and a user will have to sign-in to view
    // private routes
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  // Pass the Provider's value prop an actions object 
  // to store event handlers and actions that will be performed on data. 
  // These methods are passed down through context.

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      data: this.data,

      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        update: this.update,
        deleteDeck: this.DeleteDeck,
        getDecks: this.getDecks,
        getDeck: this.getDeck,
        createCard: this.createCard,
        getAuthor: this.getAuthor,
        getSubjects: this.getSubjects
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  signIn = async (email, password) => {
    // signIn takes a username and password credentials 
    // to call the getUser() method in Data.js
    // If credentials are valid the returned value will be an object 
    // containing the authenticated users data or will remain null upon failure
    const user = await this.data.getUser(email, password);
    if (user.token !== undefined) {
      this.setState(() => {
        return {
          authenticatedUser: {user},
        };
      });
      // Set cookie named authenticatedUser with js-cookie
      // The second arg specifies the value to store in the cookie
      // The third arg is optional and can take in various options
      // Below the expiry property is set to a value of 1, which means
      // the cookie will expire after a day
      Cookies.set('authenticatedUser', JSON.stringify(this.state.authenticatedUser), {expires: 1});
    }
    return user;
  }

  signOut = () => {
    // signOut is an event handler triggered by the sign out link in the Header
    // Once fired, the authenticatedUser state is set to null and the cookie is removed.
    this.setState(() => { 
      return {
        authenticatedUser: null,
      }
    });
    Cookies.remove('authenticatedUser')
  }

  getAuthor = async (id) => {
    const user = await this.data.getAuthor(id);
    return user;
  }

  upDateDeck = async (title, description, deckId) => {
    const update = await this.data.upDate(title, description, deckId);
    return update;
  }

  CreateDeck = async (deckPayload, credentials) => {
    const newDeck = await this.data.create(deckPayload, credentials);
    return newDeck;
  }

  DeleteDeck = async (deckId, credentials) => {
    const deleteDeck = await this.data.deleteDeck(deckId, credentials)
    return deleteDeck;
  }

  getDecks = async () => {
    const decks = await this.data.getDecks()
    return decks;
  }

  getDeck = async (id) => {
    const deck = await this.data.getDeck(id)
    this.setState(() => { 
      return {
        decktest: deck,
      }
    });
    return deck;
  }
  
  createCard = async (cardPayload, deckId, credentials) => {
    const newCard = await this.data.createCard(cardPayload, deckId, credentials);
    return newCard;
  }

  getSubjects = async () => {
    const subjects = await this.data.getSubjects()
    return subjects;
  }

}

export const Consumer = Context.Consumer;

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */
