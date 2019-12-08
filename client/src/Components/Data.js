// import config from './config';

export default class Data {

    // The api helper method makes a call to the Flashcard API and returns the value from the fetch.
    // The parameters specify the type of HTTP verb, body request object, 
    // whether authentication is required, and the users credentials if the page requires authentication.
    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null, server = 'https://flashcard-application.herokuapp.com/api') {
      const url = server + path;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      };
      // If body is not null, set the value of the options object's body property
      if (body !== null) {
        options.body = JSON.stringify(body);
      }
  
      // Check if auth is required
      if (requiresAuth) {    
        // Add Authorization property to options.headers
        // Set the Authorization type to Basic, followed by the encoded credentials, 
        // stored in the variable encodedCredentials:
        options.headers['Authorization'] = `Bearer ${credentials}`;
      }
  
      return fetch(url, options);
    }
  
    // getUser takes the users credentials and makes a GET request to the API
    // If successful the users data will be returned, otherwise the function will return null or any errors.
    async getUser(email, password) {
      const response = await this.api(`/user/login`, 'POST', { email, password }, false, null, 'https://flashcard-application.herokuapp.com/api');
      if (response.status === 200) {
        return response.json().then(data => data);
      }
      else if (response.status === 401) {
        return null;
      }
      else {
        throw new Error();
      }
    }

    async getUsers() {
      const response = await this.api(`/users`, 'GET', null, false);
      // Send GET request to API to retrieve list of users in DB
      if (response.status === 200) {
        // If status is 200, return list of users
        const users = await response.json();
        return users;
      }
      // If there is a problem retrieving the users, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async getAuthor(id) {
      // getAuthor makes a GET request to the API passing along the users id to access the relevant endpoint.
      // If successful, the API will return the users information.
      const response = await this.api(`/user/${id}`, 'GET', null, false);
      if (response.status === 200) {
        return response.json().then(data => data);
      }
      else if (response.status === 401) {
        return null;
      }
      else {
        throw new Error();
      }
    }
  
    // async update(deckPayload, deckId, credentials) {
    //   const response = await this.api(`/deck/${deckId}`, 'PUT', deckPayload, true, credentials);
    //   if (response.status === 204) {
    //     return response
    //   } 
    //   else if (response.status !== 204) {
    //     return response.json().then(data => data);
    //   } else {
    //       throw new Error();
    //   }
    // }

    async update(path, payload, credentials) {
      const response = await this.api(path, 'PUT', payload, true, credentials);
      if (response.status === 204) {
        return response
      } 
      else if (response.status !== 204) {
        return response.json().then(data => data);
      } else {
          throw new Error();
      }
    }
  
    // api(path, method = 'GET', body = null, requiresAuth = false, credentials = null, server = 'http://localhost:5000') {
    async create(deckPayload, credentials) {
      const response = await this.api('/deck/create', 'POST', deckPayload, true, credentials);
      // If user is created and a 201 status is set, return empty array
      if (response.status === 201) {
        return response.json().then(data => data);
      }
      // If there is a problem creating the user, return the data
      // Which will be the error data
      else if (response.status !== 201) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async createDeckWithCards(deckPayload, credentials) {
      const response = await this.api('/deck/createdeckwithcards', 'POST', deckPayload, true, credentials);
      // If user is created and a 201 status is set, return empty array
      if (response.status === 201) {
        return response.json().then(data => data);
      }
      // If there is a problem creating the deck, return the data
      // Which will be the error data
      else if (response.status !== 201) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async updateDeckWithCards(path, deckPayload, credentials) {
      const response = await this.api(path, 'PUT', deckPayload, true, credentials);
      // If user is created and a 201 status is set, return empty array
      if (response.status === 204) {
        return response.json().then(data => data);
      }
      // If there is a problem updating the deck, return the data
      // Which will be the error data
      else if (response.status !== 204) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async createCard(deckId, cardPayload, credentials) {
      const response = await this.api(`/deck/${deckId}/create`, 'POST', cardPayload, true, credentials);
      // If user is created and a 201 status is set, return empty array
      if (response.status === 201) {
        return response.json().then(data => data);
      }
      // If there is a problem creating the user, return the data
      // Which will be the error data
      else if (response.status !== 201) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async deleteCard(cardId, credentials) {
      const response = await this.api(`/card/${cardId}/delete`, 'DELETE', null, true, credentials) 
      // If user is deleted and a 204 status is set, return empty array
      if (response.status === 204) {
        return response;
      }
      // If there is a problem deleting the card, return the error data
      else if (response.status === 500) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

  // api(path, method = 'GET', body = null, requiresAuth = false, credentials = null, server = 'http://localhost:5000') {
    async deleteDeck(deckId, credentials) {
      const response = await this.api(`/deck/${deckId}/delete`, 'DELETE', null, true, credentials) 
      // If user is deleted and a 204 status is set, return empty array
      if (response.status === 204) {
        return response;
      }
      // If there is a problem deleting the user, return the error data
      else if (response.status === 500) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async logOut(credentials) {
      const response = await this.api(`/user/logout`, 'GET', null, true, credentials, 'https://flashcard-application.herokuapp.com/api') 
      // If user is logged out and a 204 status is set, return empty array
      if (response.status === 204) {
        return response;
      }
      // If there is a problem logginout the user, return the error data
      else if (response.status !== 204) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    
    // createUser() is an asynchronous operation that returns a promise. 
    // The resolved value of the promise is either an array of errors (sent from the API if the response is 400), 
    // or an empty array (if the response is 201).
    // Since this function returns a promise, the async keyword in front of the function
    async createUser(user) {
      // await the results returned from the api method 
      const response = await this.api('/user/create', 'POST', user, false, null, 'https://flashcard-application.herokuapp.com/api');
      // If user is created and a 201 status is set, return empty array
      if (response.status === 201) {
        return [];
      }
      // If there is a problem creating the user, return the data
      // Which will be the error data
      else if (response.status === 400) {
        return response.json().then(data => {
          return data
        });
      }
      else {
        throw new Error();
      }
    }
  
    async getDecks() {
      const response = await this.api(`/decks`, 'GET', null, false);
      // Send GET request to API to retrieve list of decks in DB
      if (response.status === 200) {
        // If status is 200, return list of decks
        const decks = await response.json();
        return decks
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

  
    async getDeck(id) {
      const response = await this.api(`/deck/${id}`, 'GET', null, false);
      // Send GET request to API to retrieve data for an individual deck
      if (response.status === 200) {
        // If status is 200, return deck data
        const deck = await response.json();
        return deck
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }


    async getCard(id) {
      const response = await this.api(`/card/${id}`, 'GET', null, false);
      // Send GET request to API to retrieve data for an individual deck
      if (response.status === 200) {
        // If status is 200, return deck data
        const card = await response.json();
        return card
      }
    }

    async getUserDecks(id) {
      const response = await this.api(`/user/${id}`, 'GET', null, false);
      // Send GET request to API to retrieve data for an user's decks
      if (response.status === 200) {
        // If status is 200, return deck data
        const decks = await response.json();
        return decks;
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async getSubjects() {
      const response = await this.api(`/subjects`, 'GET', null, false);
      // Send GET request to API to retrieve list of subjects in database
      if (response.status === 200) {
        // If status is 200, return deck data
        const subjects = await response.json();
        return subjects;
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async getAllSubjects() {
      const response = await this.api(`/subjects/search`, 'GET', null, false);
      // Send GET request to API to retrieve list of subjects in database
      if (response.status === 200) {
        // If status is 200, return deck data
        const subjects = await response.json();
        return subjects;
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async getSubjectDecks(id) {
      const response = await this.api(`/subject/${id}`, 'GET', null, false);
      // Send GET request to API to retrieve data for an user's decks
      if (response.status === 200) {
        // If status is 200, return deck data
        const decks = await response.json();
        return decks;
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    async getDeckSearch(category, term) {
      const response = await this.api(`/decksearch/${category}/${term}`, 'GET', null, false);
      // Send GET request to API to retrieve data for an user's decks
      if (response.status === 200) {
        // If status is 200, return deck data
        const decks = await response.json();
        return decks;
      }
      // If there is a problem retrieving the decks, return the error data
      else if (response.status !== 200) {
        return response.json().then(data => data);
      }
      else {
        throw new Error();
      }
    }

    
  }
  
  
  
  