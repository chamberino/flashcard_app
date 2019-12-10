const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var bcrypt = require('bcryptjs');
const { auth } = require('../middleware/index');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

// const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

exports.user_logout = (req, res, next) => {
   // delete session object
  req.session.destroy( (err) => {
    if (err) {
      return next(err)
    } else {
      return res.status(204).json('User successfully logged out!')
    }
  })
}

// // Post route for creating a new user
exports.user_create_post = [
    check('username')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a valid username'),
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
            // store errors in an array and send in response
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        } else {
            User.findOne({ 'username': req.body.username })
            .exec( function(err, found_user) {
               if (err) { return next(err); }
    
               if (found_user) {
                 // User exists.
                 res.status(400);
                 res.json('User already registered');
               } else {
                 User.findOne({ 'email': req.body.email})
                 .exec( function(err, found_user) {
                   if (err) { return next(err); }

                   if (found_user) {
                     // Email exists.
                     res.status(400);
                     res.json('Email already registered');
                   } else {    
                    // Create a User object with escaped and trimmed data.
                    // Note that User model hashed the user password before persisting to the database
                    var user = new User(
                        {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password
                        });
                    User.create(user, (error, user) => {
                        if (error) {
                            return next(error)
                        } else {
                            // return res.redirect('/')
                            jwt.sign(
                            { id: user._id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '45m' },
                            // callback
                            (err, token) => {
                              if(err) {
                                res.json(err)
                              } 
                              req.session.token = token;
                              res.json({
                                token,
                                user: {
                                  id: user._id,
                                  username: user.username,
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
            });
        }
    }
];


exports.getUser = (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
}

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};