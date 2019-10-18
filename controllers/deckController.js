var Deck = require('../models/deck');
var User = require('../models/user');
var Subject = require('../models/subject');
var Card = require('../models/card');
var mongoose = require('mongoose');
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
        res.json({ title: 'FlashCard Home', error: err, data: results });
        // res.render('index', { title: 'FlashCard Home', error: err, data: results });
    });
};
// Display list of all decks.
exports.deck_list = function(req, res) {
    
    Deck.find({}, 'title user')
    .populate('user')
    .exec(function (err, list_decks) {
      if (err) { 
            // Log error and set status code if there's a problem retrieving the decks
            const error = new Error('There was an error retrieving the decks'); //throw custom error    
            error.status = 400;
            next(error); // pass error along to global error handler
       }
      //Successful, so render
      res.json({title: 'List of Decks', deck_list: list_decks});
    //   res.render('deck_list', { title: 'List of Decks', deck_list: list_decks });
    });

};

// Display detail page for a specific deck.
exports.deck_detail = function(req, res) {
        const id = mongoose.Types.ObjectId(req.params.id);
    
        async.parallel({
            deck: function(callback) {
    
                Deck.findById(id)
                  .populate('user')
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
            // Successful, so render.
            res.render('deck_detail', { title: results.deck.title, deck: results.deck, cards: results.card } );
        });
    };

// Display deck create form on GET.
exports.deck_create_get = function(req, res) {
        // Get all users and subjects, which we can use for adding to our deck.
        async.parallel({
            users: function(callback) {
                User.find(callback);
            },
            subjects: function(callback) {
                Subject.find(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            // if (results.users == null) { // No results.
            //                 var err = new Error('No users found');
            //                 err.status = 404;
            //                 return next(err);
            // }
            // if (results.subjects == null) { // No results.
            //                 var err = new Error('No subjects found');
            //                 err.status = 404;
            //                 return next(err);
            // }
            res.status(200);
            res.render('deck_form', { users: results.users, subjects: results.subjects })
            // res.json({ users: results.users, subjects: results.subjects });
        });
};


// // Display deck delete form on GET.
// exports.deck_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Deck delete GET');
// };

// Display deck delete form on GET.
exports.deck_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck delete POST');
};

// Handle deck create on POST.
exports.deck_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.subject instanceof Array)){
            if(typeof req.body.subject==='undefined')
            req.body.subject=[];
            else
            req.body.subject=new Array(req.body.subject);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('user', 'User must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Deck object with escaped and trimmed data.
        var deck = new Deck(
          { title: req.body.title,
            user: req.body.user,
            subject: req.body.subject
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                users: function(callback) {
                    User.find(callback);
                },
                subjects: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.subjects.length; i++) {
                    if (deck.subjects.indexOf(results.subjects[i]._id) > -1) {
                        results.subjects[i].checked='true';
                    }
                }
                res.render('deck_form', { title: 'Create Deck',users:results.users, subjects:results.subjects, deck: deck, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save deck.
            deck.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new deck record.
                   res.redirect(deck.url);
                });
        }
    }
];

// Display deck delete form on GET.
exports.deck_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck delete GET');
};

// Handle deck delete on POST.
exports.deck_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck delete POST');
};

// Display deck update form on GET.
exports.deck_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update GET');
};

// Handle deck update on POST.
exports.deck_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update POST');
};