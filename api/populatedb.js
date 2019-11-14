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
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var subjects = []
var decks = []
var cards = []

function userCreate(_id, username, email, password, cb) {
  userdetail = {
    _id: _id, 
    username: username, 
    email: email,
    password: password 
  }
  
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

function subjectCreate(_id, name, cb) {  
  var subject = new Subject({_id:_id, name: name});
       
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

function deckCreate(_id, title, user, subject, cb) {
  deckdetail = { 
    _id: _id,
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


function cardCreate(_id, deck, question, answer, hint, cb) {
  cardDetail = { 
    _id: _id,
    deck: deck,
    question: question,
    answer: answer
  }    
  if (hint != false) cardDetail.hint = hint
  
  var card = new Card(cardDetail);    
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
          userCreate(mongoose.Types.ObjectId('5dbb595b45a2ef0e1752b843'),'Patrick', 'Rothfuss', 'p@r.com', 'pass', callback);
        },
        function(callback) {
          userCreate(mongoose.Types.ObjectId('5dbb59685570610e18cc5c45'), 'Ben', 'Bova', 'b@b.com', 'pass', callback);
        },
        function(callback) {
          userCreate(mongoose.Types.ObjectId('5dbb59c259c05f0e304059e0'), 'Isaac', 'Asimov', 'i@a.com', 'pass', callback);
        },
        function(callback) {
          userCreate(mongoose.Types.ObjectId('5dbb59bc59c05f0e304059de'), 'Bob', 'Billings', 'b@bi.com', 'pass', callback);
        },
        function(callback) {
          userCreate(mongoose.Types.ObjectId('5dbb59c259c05f0e304059df'), 'Jim', 'Jones', 'j@j.com', 'pass', callback);
        },
        function(callback) {
          subjectCreate('5dbcd7d057c65b1ab2319329', 'JavaScript', callback);
        },
        function(callback) {
          subjectCreate('5dbcd7d157c65b1ab231932a', 'History', callback);
        },
        function(callback) {
          subjectCreate('5dbcd7d157c65b1ab231932b', 'Node.JS', callback);
        },
        function(callback) {
          subjectCreate('5dbcd7d157c65b1ab231932c', 'Geography', callback);
        },
        ],
        // optional callback
        cb);
}

function createDecks(cb) {
  async.series([
      function(callback) {
        deckCreate('5dbcd7d157c65b1ab231932d', 'Express', users[0], [subjects[2],subjects[0],], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d157c65b1ab231932e', 'React', users[0], [subjects[1],subjects[0],], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d157c65b1ab231932f', 'Gulp', users[0], [subjects[1],subjects[0],], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d157c65b1ab2319330', 'American History: Reconstruction', users[1], [subjects[1],], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d257c65b1ab2319331', 'Age of Enlightenment', users[1], [subjects[1],], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d257c65b1ab2319332', 'State Capitals', users[2], [subjects[1],subjects[3]], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d257c65b1ab2319334', 'Ancient Egypt', users[4], [subjects[1]], callback);
      },
      function(callback) {
        deckCreate('5dbcd7d257c65b1ab2319333', 'World War I', users[4], [subjects[1]], callback);
      },
      ],
      // optional callback
      cb);
}


function createCards(cb) {
  async.parallel([
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319335', decks[0], 'Express takes information sent from the client and makes it available through the request object on a property called...', 'req.body', 'This is how you consume json. You use req.[blank]', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319336', decks[1], 'Almost everything in React is considered a', 'Component.', 'These are the building blocks of React. There are two types...a Class or function.', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319338', decks[2], 'Is Gulp a framework?', 'No, it is a task-runner, for running common build patterns such as compiling Sass.', 'The main purpose of gulp is automating development tasks', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319337', decks[2], 'Is Gulp based on node.js', 'Yes.', 'To install Gulp, you must use NPM', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319339', decks[3], 'Which three presidents held office during the Reconstruction Era?', 'Abraham Lincoln, Andrew Johnson, Ulysses S. Grant.', 'Honest [blank], Impeached, General of the Union', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933a', decks[3], 'Derogatory term for an individual from the North who relocated to the South during the Reconstruction period to exploit the local populace.', 'Carpetbagger', 'man 1: You sir, are a Scalawag! man 2: Better to be a scalawag than a [blank]', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933b', decks[4], 'Which pamphlet did Thomas Paine write challenging the authority of the British government and the royal monarchy?', 'Answer.', 'Hint!', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933c', decks[4], 'John Locke\'s \'An Essay Concerning Human Understanding\', concerning the foundation of human knowledge and understanding is an example of this branch of philosophy?', 'Epistemology.', 'Comes from the Greek word episteme', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933d', decks[4], 'The Enlightenment was marked by an emphasis on this scientific process...', 'The Scientific Method', 'Question, Hypothesis, Predicition, Testing...', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933e', decks[0], 'This is used to create modular, mountable route handlers', 'Express.Router', 'An instance of this is a complete middleware and ROUTING system', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319343', decks[1], 'What process involves making data accessible throughout the component tree in React', 'Prop Drilling', 'You have to pass these values along and it can be a tedious DRILL', callback)
      },
      function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319348', decks[5], "Alabama", "Montgomery", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934d', decks[5], "Alaska", "Juneau", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319352', decks[5], "Arizona", "Phoenix", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319357', decks[5], "Arkansas", "Little Rock", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231933f', decks[5], "California", "Sacramento", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319347', decks[5], "Colorado", "Denver", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934c', decks[5], "Connecticut", "Hartford", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319340', decks[5], "Delaware", "Dover", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319344', decks[5], "Florida", "Tallahassee", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319349', decks[5], "Georgia", "Atlanta", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319341', decks[5], "Hawaii", "Honolulu", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319345', decks[5], "Idaho", "Boise", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934a', decks[5], "Illinois", "Springfield", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319342', decks[5], "Indiana", "Indianapolis", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319346', decks[5], "Iowa", "Des Moines", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934b', decks[5], "Kansas", "Topeka", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319351', decks[5], "Kentucky", "Frankfort", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319356', decks[5], "Louisiana", "Baton Rouge", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935b', decks[5], "Maine", "Augusta", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934e', decks[5], "Maryland", "Annapolis", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319353', decks[5], "Massachusetts", "Boston", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319358', decks[5], "Michigan", "Lansing", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231934f', decks[5], "Minnesota", "Saint Paul", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319354', decks[5], "Mississippi", "Jackson", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319359', decks[5], "Missouri", "Jefferson City", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319350', decks[5], "Montana", "Helana", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319355', decks[5], "Nebraska", "Lincoln", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935a', decks[5], "Nevada", "Carson City", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935c', decks[5], "New Hampshire", "Concord", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319361', decks[5], "New Jersey", "Trenton", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319366', decks[5], "New Mexico", "Santa Fe", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319360', decks[5], "New York", "Albany", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319365', decks[5], "North Carolina", "Raleigh", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936a', decks[5], "North Dakota", "Bismarck", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935d', decks[5], "Ohio", "Columbus", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319362', decks[5], "Oklahoma", "Oklahoma City", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319367', decks[5], "Oregon", "Salem", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936c', decks[5], "Pennsylvania", "Harrisburg", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935e', decks[5], "Rhode Island", "Providence", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319363', decks[5], "South Carolina", "Columbia", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319368', decks[5], "South Dakota", "Pierre", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936d', decks[5], "Tennessee", "Nashville", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231935f', decks[5], "Texas", "Austin", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319364', decks[5], "Utah", "Salt Lake City", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319369', decks[5], "Vermont", "Montpelier", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936e', decks[5], "Virginia", "Richmond", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936b', decks[5], "Washington", "Olympia", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319370', decks[5], "West Virginia", "Charleston", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab231936f', decks[5], "Wisconsin", "Madison", false, callback)
      }, function(callback) {
        cardCreate('5dbcd7d257c65b1ab2319371', decks[5], "Wyoming", "Cheyenne", false, callback)
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
