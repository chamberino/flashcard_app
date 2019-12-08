const User = require('../models/user');
const Deck = require('../models/deck');
const Card = require('../models/card');
const async = require('async');
var mongoose = require('mongoose');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Display list of all users
exports.user_list = (req, res) => {
    User.find()
    .sort([['username', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      res.json({ title: 'User List', user_list: list_users });
    });
};

// Display detail page for a specific User.
exports.user_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    // const id = req.params.id;
    async.parallel({
        user: function(callback) {
            User.findById(id)
              .select('-password')
              .exec(callback)
        },
        user_decks: function(callback) {
            console.log(id)
          Deck.find({ 'user': id },'title')
            .populate('subject user')
            .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
          const error = new Error('User not found'); // custom error message
          error.status = 400;
          next(error)
        }
        else {
        res.json({ user: results.user, username: results.user.username, user_decks: results.user_decks } );
        }
    });
};

// Handle User create on POST
exports.user_create_post = [
    // Validate fields.
    check('username')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Username must be specified.'),
        // .isAlphanumeric()
        // .withMessage('First name has non-alphanumeric characters.'),
    check('email')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a valid email'),
    check('password')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a password'),    

    // Sanitize fields.
    sanitizeBody('username').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // If there are validation errors...
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        }
        else if (!emailRegEx.test(req.body.email)) {
            const error = ['Please enter a valid address. Example: foo@bar.com'];
            res.status(400);
            return res.json(error);
        } else {
            User.findOne({ 'email': req.body.email })
            .exec( function(err, found_user) {
               if (err) { return next(err); }
    
               if (found_user) {
                 // User exists, redirect to its detail page.
                 res.status(400);
                    const errorMessages = [];
                    errorMessages.push('Email already registered')
                    return res.json(errorMessages);
               }
               else {     
                    // Create a User object with escaped and trimmed data.
                    var user = new User(
                        {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password
                        });
                    // Users' password is hashed in the User model schema before persisting to the database.
                    User.create(user, (error, user) => {
                        if (error) {
                            return next(error)
                        } else {
                            // return res.redirect('/')
                            jwt.sign(
                            { id: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '10m' },
                            // callback
                            (err, token) => {
                              if(err) {
                                res.json(err)
                              } 
                              return res.status(201).json({
                                token,
                                user: {
                                  id: user._id,
                                  name: user.name,
                                  email: user.email
                                }
                              })
                            }
                            )                            
                        }
                    })   
               }    
            });
        }
    }
];

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {
    User.findById(req.params.id)
    .then((user) => {
            if (!user) { 
                const error = new Error('Cannot find the requested resource to update'); // custom error message
                error.status = 400;
                next(error); // catch any other errors and pass errors to global error handler
            } else if (!(user._id == req.user.id)) {
                const error = new Error('Users may only delete their own accounts'); // custom error message
                error.status = 403;
                next(error); // catch any other errors and pass errors to global error handler
            } else { // delete matched user
                return user.remove()
                .then((user)=>{
                    if (!user) { 
                        const error = new Error('There was a problem deleting the account'); // custom error message
                        error.status = 400;
                        next(error);
                    } else {
                        Deck.find({'user': req.user.id})
                        .select('_id')
                            .then((decks)=>{
                                if(!decks) {
                                    var err = new Error('problem getting decks');
                                    err.status = 404;
                                    return next(err);
                                } else {
                                    // delete all decks associated with user
                                    Deck.deleteMany({
                                        '_id': { $in: 
                                            decks.map(deck=>deck._id)
                                        }    
                                    }, function(err, deletedDecks) {

                                        if (err) {
                                            return res.json([err])
                                        } 
                                        if (deletedDecks) {
                                            res.status(204).end();
                                        }
                                    })
                                    .catch(()=>{
                                        // catch any other errors and pass errors to global error handler
                                        next(error);
                                    })

                                    Card.find({
                                        'deck': { $in:
                                            decks.map(deck=>deck._id)
                                            }
                                    }, function(err, cards){
                                        if (err) {
                                            const error = new Error(err);
                                            next(error)
                                        } else {
                                            Card.deleteMany({
                                                '_id': { $in: 
                                                    cards.map(card=>card._id)
                                                }    
                                            }, function(err, cards){
                                                if (err) {
                                                    const error = new Error(err);
                                                    next(error)
                                                } else {
                                                    res.json(cards)
                                                }
                                            }).catch((error)=>{
                                                if (error) {
                                                    return next(error)
                                                } 
                                            })
                                        }
                                    }).catch((error)=>{
                                    if (error) {
                                        return next(error)
                                    } 
                                })
                            }
                            }).catch((error) => {
                            const err = new Error(error)
                            return next(err) 
                        })
                    }
                }).catch((error) => {
                    // catch any other errors and pass errors to global error handler
                    next(error);
                });
            }
        // }
    }).catch((error) => {  
        // catch any other errors and pass errors to global error handler
        next(error);
    });
  };


// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
