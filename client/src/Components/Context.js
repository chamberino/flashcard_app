import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    // if a an 'authenticatedUser' cookie exists, then state is set to it's value
    // Otherwise the value of authenticatedUser is null and a user will have to sign-in to view
    // private routes
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    searchResults: {}
  };

  constructor() {
    super();
    this.data = new Data();
  }

  // Pass the Provider's value prop an actions object 
  // to store event handlers and actions that will be performed on data. 
  // These methods are passed down through context.

  render() {
    const { authenticatedUser, searchResults} = this.state;
    const value = {
      authenticatedUser,
      searchResults,

      data: this.data,

      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        update: this.update,
        updateDeck: this.updateDeck,
        deleteDeck: this.deleteDeck,
        getDecks: this.getDecks,
        getDeck: this.getDeck,
        getCard: this.getCard,
        getUsers: this.getUsers,
        getUserDecks: this.getUserDecks,
        getSubjectDecks: this.getSubjectDecks, 
        getTitleDecks: this.getTitleDecks, 
        createCard: this.createCard,
        deleteCard: this.deleteCard,
        getAuthor: this.getAuthor,
        getSubjects: this.getSubjects,
        searchText: this.searchText,
        getCriteria: this.getCriteria
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  signIn = async (username, password) => {
    // signIn takes a username and password credentials 
    // to call the getUser() method in Data.js
    // If credentials are valid the returned value will be an object 
    // containing the authenticated users data or will remain null upon failure
    const user = await this.data.getUser(username, password);
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

  signOut = async (credentials) => {
    // signOut is an event handler triggered by the sign out link in the Header
    // Once fired, the authenticatedUser state is set to null and the cookie is removed.

    // NOTE: This function should make a call to the database and revoke/delete the refreshToken from 
    // the mongo session store

    const logOut = await this.data.logOut(credentials);
      if (logOut.status !== undefined) {
        this.setState(() => { 
          return {
            authenticatedUser: null,
          }
        });
        Cookies.remove('authenticatedUser')
      } 
      return logOut;
  }

  getAuthor = async (id) => {
    const user = await this.data.getAuthor(id);
    return user;
  }

  update = async (path, payload, credentials) => {
    const update = await this.data.update(path, payload, credentials);
    return update;
  }

  CreateDeck = async (deckPayload, credentials) => {
    const newDeck = await this.data.create(deckPayload, credentials);
    return newDeck;
  }

  deleteDeck = async (deckId, credentials) => {
    const deleteDeck = await this.data.deleteDeck(deckId, credentials)
    return deleteDeck;
  }

  getDecks = async () => {
    const decks = await this.data.getDecks();
    return decks;
  }

  getTitleDecks = async (title) => {
    const decks = await this.data.getTitleDecks(title);
    this.setState(() => { 
      return {
        searchResults: decks
      }
    });
    return decks;
  }

  getUsers = async () => {
    const users = await this.data.getUsers();
    return users;
  }

  getUserDecks = async (id) => {
    const decks = await this.data.getUserDecks(id);
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

  getCard = async (id) => {
    const card = await this.data.getCard(id)
    this.setState(() => { 
      return {
        cardTest: card,
      }
    });
    return card;
  }

  createCard = async (cardPayload, deckId, credentials) => {
    const newCard = await this.data.createCard(cardPayload, deckId, credentials);
    return newCard;
  }

  deleteCard = async (deckId, credentials) => {
    const deleteCard = await this.data.deleteCard(deckId, credentials)
    return deleteCard;
  }

  getSubjects = async () => {
    const subjects = await this.data.getSubjects()
    return subjects;
  }

  getSubjectDecks = async (id) => {
    const decks = await this.data.getSubjectDecks(id);
    return decks;
  }

  searchText = (input) => {
    this.setState(() => { 
      return {
        searchInput: input
      }
    });
  }

  getCriteria = (input) => {
    this.setState(() => { 
      return {
        searchCriteria: input
      }
    });
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
