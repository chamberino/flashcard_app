const User = require('../models/user');
const Deck = require('../models/deck');
const async = require('async');
var mongoose = require('mongoose');
const { body,check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var bcrypt = require('bcryptjs');
var auth = require('basic-auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Display list of all users
exports.user_list = (req, res) => {
    User.find()
    .sort([['last_name', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      res.json({ title: 'User List', user_list: list_users });
    });
};

// Display detail page for a specific User.
exports.user_detail = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        user: function(callback) {
            User.findById(id)
              .exec(callback)
        },
        user_decks: function(callback) {
          Deck.find({ 'user': id },'title')
            .populate('subject')
            .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        console.log('results: ' + results.user_decks)
        // Successful, so render.
        res.json({ title: 'User Detail', user: results.user, user_decks: results.user_decks } );
    });
};

// Display profile page for a specific User.
exports.user_profile = function(req, res, next) {
    if (!req.session.userId) {
        const err = new Error("You are not authorized to view this page");
        err.status = 403;
        return next(err);
    }
    User.findById(req.session.userId)
        .exec(function (error, user) {
          if (error) {
            return next(error);
          } else {
            return res.json({ title: 'Profile', name: user.name });
          }
        });
  }

// Display User create form on GET.
exports.user_login_get = (req, res) => {
    res.json({ title: 'Log In'});
};

// Display User create form on GET.
// helpful video on jwt web tokens
// https://www.youtube.com/watch?v=mbsmsi7l3r4&feature=youtu.be
// exports.user_login_post = [
//     (req, res, next) => {
//         if (req.body.email && req.body.password) {
//           User.authenticate(req.body.email, req.body.password, function(error, user) {
//             if (error || !user) {
//               const err = new Error('Credentials do not match')
//               err.status = 401;
//               return next(err);
//             } else {
//               // user._id is what we get back from the authenticate method when credentials match
//               // req.session.userId = user._id;
              
//               return res.redirect('/profile');
//             // const user = {
//             //   email: req.body.email
//             // }
//             // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//             // res.json( { accessToken: accessToken} )
//             // return res.redirect('/catalog/user/' + user._id)
//             }
//           });
//         } else {
//           const err = new Error('Email and password are required');
//           err.status = 401;
//           return next(err);
//         }
//       }
// ]

// exports.user_logout = (req, res, next) => {
//     if (req.session) {
//       // delete session object
//       req.session.destroy( (err) => {
//         if (err) {
//           return next(err)
//         } else {
//           return res.redirect('/');
//         }
//       })
//     }
//   }

// Display User create form on GET.
exports.user_create_get = (req, res) => {
    res.json({ title: 'Sign Up'});
};

// Handle User create on POST
exports.user_create_post = [
    // Validate fields.
    check('first_name')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    check('last_name')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Last name must be specified.')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),
    check('email')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a valid email'),
    check('password')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a password'),    

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // If there are validation errors...
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
            // res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            // return;
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
                 res.json('User already registered');
               }
               else {     
                    // Hash the new user's password before persisting to the database.
                    // var hash = bcrypt.hashSync(req.body.password);
                    // req.body.password = hash;
                    // Create a User object with escaped and trimmed data.
                    var user = new User(
                        {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: req.body.password
                        });
                    // user.save(function (err) {
                    //     if (err) { return next(err); }
                    //     // set location header, set status code and close response returning no data
                    //     res.location('/');
                    //     res.status(201).end();
                    // }); 
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
                              res.json({
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


// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
