var Deck = require('../models/deck');
var User = require('../models/user');
var Subject = require('../models/subject');
var Card = require('../models/card');
var mongoose = require('mongoose');
const mid = require('../middleware/index');
const { body,check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        deck_count: function(callback) {
            Deck.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        card_count: function(callback) {
            Card.countDocuments({}, callback);
        },
        user_count: function(callback) {
            User.countDocuments({}, callback);
        },
        subject_count: function(callback) {
            Subject.countDocuments({}, callback);
        }
    }, function(err, results) {
        if (err) {
            const error = new Error('There was an error retrieving the flashcard data'); //throw custom error    
            error.status = 400;
            next(error); // pass error along to global error handler
        }
        res.json({ title: 'FlashCard Home', error: err, data: results });
    });
};

// Display list of all decks.
exports.deck_list = function(req, res, next) {
    Deck.find({}, 'title user')
    .populate('user', '_id first_name last_name')
    .exec(function (err, list_decks) {
      if (err) { 
            // Log error and set status code if there's a problem retrieving the decks
            const error = new Error('There was an error retrieving the decks'); //throw custom error    
            error.status = 400;
            next(error); // pass error along to global error handler
       }
      //Successful, so send data
      res.json({title: 'List of Decks', deck_list: list_decks});
    });
};

// Display detail page for a specific deck.
exports.deck_detail = function(req, res, next) {
        const id = mongoose.Types.ObjectId(req.params.id);
    
        async.parallel({
            deck: function(callback) {
    
                Deck.findById(id)
                  .populate('user', '_id first_name last_name')
                  .populate('subject')
                  .exec(callback);
            },
            card: function(callback) {
    
              Card.find({ 'deck': id })
              .exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.deck == null) { // No results.
                var err = new Error('Deck not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so send data.
            res.json({ title: results.deck.title, deck: results.deck, cards: results.card });
        });
    };

// Display deck create form on GET.
exports.deck_create_get = function(req, res) {
        // Get all subjects, which we can use for adding to our deck.

    Subject.find()
    .exec(function (err, list_subjects) {
        if (err) { 
        var err = new Error('Subjects not found');
        err.status = 404;
        return next(err);
        }
          // Successful, so render
            res.json({ title: 'Create Deck', subjects: list_subjects });
    });
};

// Handle post deck route
// Request body should be formatted like this...
//
exports.deck_create_post = [
        check('title')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('Title required'),
          check('user')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('User not recognized. Please sign in again.'),
          check('subject')
          .exists({ checkNull: true, checkFalsy: true })
          .isArray({min:1})
          .withMessage('Subject required'),
        sanitizeBody('title').escape(),
(req, res, next) => {
    const errors = validationResult(req);
    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        // Create custom error with 400 status code
        res.status(400);
        return res.json(errorMessages);
    } else {
        console.log(req.body)
    Deck.create(req.body)
            .then((deck)=>{
                if (!deck) {
                    res.status(400);
                    const errorMessages = [];
                    errorMessages.push("This deck already exists")
                    return res.json(errorMessages);
                } else {
                    console.log(deck._id)
                    // res.location(`/decks/${deck._id}`);                        
                    return res.status(201).json({id: deck._id, status: 201});                
                }
            }).catch((error)=> {  // check for errors within body
                if (error) {
                    // catch any other errors and pass errors to global error handler
                    next(error);
                }
            });
        };
    }
]


// Display deck delete form on GET.
exports.deck_delete_post = function(req, res, next) {
//     const id = mongoose.Types.ObjectId(req.params.id);
const id = '5db0b5f8e7af6d122cc38dfc';
    Deck.findById(id)
    .then((deck) => {
        // the deck creator is checked against the req.currentUser.id passed along from auth middleware
        if(!(deck.userId == req.currentUser.id)) {
            res.status(403).json({ message: 'Users may only delete decks they created themselves' });
        } else {
            if (!deck) { 
                const error = new Error('Cannot find the requested resource to update'); // custom error message
                error.status = 400;
                next(error); // catch any other errors and pass errors to global error handler
            } else { // delete matched deck
                return deck.destroy()
                .then((deck)=>{
                    if (!deck) { 
                        const error = new Error('There was a problem deleting the deck'); // custom error message
                        error.status = 400;
                        next(error);
                    } else {
                    res.status(204).end();
                    }
                }).catch((error) => {
                    // catch any other errors and pass errors to global error handler
                    next(error);
                });
            }
        }
    }).catch((error) => {  
        // catch any other errors and pass errors to global error handler
        next(error);
    });
}

// Display deck update form on GET.
exports.deck_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update GET');
};

// Handle deck update on POST.
exports.deck_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update POST');
};