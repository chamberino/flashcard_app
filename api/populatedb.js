#! /usr/bin/env node

console.log('This script populates some test cards, decks, subjects and users to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Deck = require('./models/deck')
var User = require('./models/user')
var Subject = require('./models/subject')
var Card = require('./models/card')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var subjects = []
var decks = []
var cards = []

function userCreate(first_name, last_name, email, password, cb) {
  userdetail = {first_name:first_name , last_name: last_name, email: email, password: password }
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function subjectCreate(name, cb) {  
  var subject = new Subject({name: name});
       
  subject.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Subject: ' + subject);
    subjects.push(subject)
    cb(null, subject)
  }  );
}

function deckCreate(title, user, subject, cb) {
  deckdetail = { 
    title: title,
    user: user,
    subject: subject
  }

  var deck = new Deck(deckdetail);    
  deck.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Deck: ' + deck);
    decks.push(deck)
    cb(null, deck)
  }  );
}


function cardCreate(deck, question, answer, hint, cb) {
  carddetail = { 
    deck: deck,
    question: question,
    answer: answer,
    hint: hint,
  }    
    
  var card = new Card(carddetail);    
  card.save(function (err) {
    if (err) {
      console.log('ERROR CREATING CARD: ' + card);
      cb(err, null)
      return
    }
    console.log('New Card: ' + card);
    cards.push(card)
    cb(null, card)
  }  );
}


function createSubjectUsers(cb) {
    async.series([
        function(callback) {
          userCreate('Patrick', 'Rothfuss', 'p@r.com', 'pass', callback);
        },
        function(callback) {
          userCreate('Ben', 'Bova', 'b@b.com', 'pass', callback);
        },
        function(callback) {
          userCreate('Isaac', 'Asimov', 'i@a.com', 'pass', callback);
        },
        function(callback) {
          userCreate('Bob', 'Billings', 'b@bi.com', 'pass', callback);
        },
        function(callback) {
          userCreate('Jim', 'Jones', 'j@j.com', 'pass', callback);
        },
        function(callback) {
          subjectCreate("JavaScript", callback);
        },
        function(callback) {
          subjectCreate("History", callback);
        },
        function(callback) {
          subjectCreate("Node.JS", callback);
        },
        ],
        // optional callback
        cb);
}

function createDecks(cb) {
  async.parallel([
      function(callback) {
        deckCreate('Express', users[0], [subjects[0],], callback);
      },
      function(callback) {
        deckCreate('React', users[0], [subjects[0],], callback);
      },
      function(callback) {
        deckCreate('Gulp', users[0], [subjects[0],], callback);
      },
      function(callback) {
        deckCreate('American History: Reconstruction', users[1], [subjects[1],], callback);
      },
      function(callback) {
        deckCreate('Age of Enlightenment', users[1], [subjects[1],], callback);
      },
      function(callback) {
        deckCreate('Ancient Egypt', users[4], [subjects[0],subjects[1]], callback);
      },
      function(callback) {
        deckCreate('World War I', users[4], [subjects[0],subjects[1]], callback);
      },
      ],
      // optional callback
      cb);
}


function createCards(cb) {
  async.parallel([
      function(callback) {
        cardCreate(decks[0], 'Express takes information sent from the client and makes it available through the request object on a property called...', 'req.body', 'This is how you consume json. You use req.[blank]', callback)
      },
      function(callback) {
        cardCreate(decks[1], 'Almost everything in React is considered a', 'Component.', 'These are the building blocks of React. There are two types...a Class or function.', callback)
      },
      function(callback) {
        cardCreate(decks[2], 'Is Gulp a framework?', 'No, it is a task-runner, for running common build patterns such as compiling Sass.', 'The main purpose of gulp is automating development tasks', callback)
      },
      function(callback) {
        cardCreate(decks[2], 'Is Gulp based on node.js', 'Yes.', 'To install Gulp, you must use NPM', callback)
      },
      function(callback) {
        cardCreate(decks[3], 'Which three presidents held office during the Reconstruction Era?', 'Abraham Lincoln, Andrew Johnson, Ulysses S. Grant.', 'Honest [blank], Impeached, General of the Union', callback)
      },
      function(callback) {
        cardCreate(decks[3], 'Derogatory term for an individual from the North who relocated to the South during the Reconstruction period to exploit the local populace.', 'Carpetbagger', 'man 1: You sir, are a Scalawag! man 2: Better to be a scalawag than a [blank]', callback)
      },
      function(callback) {
        cardCreate(decks[4], 'Which pamphlet did Thomas Paine write challenging the authority of the British government and the royal monarchy?', 'Answer.', 'Hint!', callback)
      },
      function(callback) {
        cardCreate(decks[4], 'John Locke\'s \'An Essay Concerning Human Understanding\', concerning the foundation of human knowledge and understanding is an example of this branch of philosophy?', 'Epistemology.', 'Comes from the Greek word episteme', callback)
      },
      function(callback) {
        cardCreate(decks[4], 'The Enlightenment was marked by an emphasis on this scientific process...', 'The Scientific Method', 'Question, Hypothesis, Predicition, Testing...', callback)
      },
      function(callback) {
        cardCreate(decks[0], 'This is used to create modular, mountable route handlers', 'Express.Router', 'An instance of this is a complete middleware and ROUTING system', callback)
      },
      function(callback) {
        cardCreate(decks[1], 'What process involves making data accessible throughout the component tree in React', 'Prop Drilling', 'You have to pass these values along and it can be a tedious DRILL', callback)
      }
      ],
      // Optional callback
      cb);
}


async.series([
    createSubjectUsers,
    createDecks,
    createCards
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
      console.log('Cards: '+ cards);
      
  }
    // All done, disconnect from database
    mongoose.connection.close();
});
