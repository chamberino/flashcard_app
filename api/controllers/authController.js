const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var bcrypt = require('bcryptjs');
const { auth } = require('../middleware/index');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Display User create form on GET.
exports.user_login_get = (req, res) => {
    res.render('user_login', { title: 'Log In'});
};


// Post route for loggin in an existing user
// helpful video on jwt web tokens
// https://www.youtube.com/watch?v=mbsmsi7l3r4&feature=youtu.be
// exports.user_login_post = (req, res) => {
//     if (req.body.email && req.body.password) {
//       User.authenticate(req.body.email, req.body.password, function(error, user) {
//         if (error || !user) {
//           const err = new Error('Credentials do not match')
//           err.status = 401;
//           res.send(err);
//         } else {
//             jwt.sign(
//                 { id: user._id },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: '10m' },
//                 // callback
//                 (err, token) => {
//                   if(err) {
//                     res.json(err)
//                   } 
//                   req.session.token = token;
//                   res.json({
//                     token,
//                     user: {
//                       id: user._id,
//                       name: user.name,
//                       email: user.email
//                     }
//                   })
//                 }
//             )  
//         }
//       });
//     } else {
//       const err = new Error('Email and password are required');
//       err.status = 401;
//       res.json(err);
//     }
//   };


exports.user_login_post = (req, res) => {
if (!req.body.email || !req.body.password) {
  const err = new Error('Email and password are required');
  err.status = 401;
  res.json(err);
} else {
  User.findOne({ email: email })

  .exec( function(error, user) {
      if (error) {
          return callback(error)
      } else if ( !user ) {
          const err = new Error('User not found.');
          err.status = 401;
          return callback(err);
      }
      bcrypt.compare(password, user.password, function(error, result) {
          if (result === true) {
              return callback(null, user)
          } else {
              return callback(error);
          }
      })
  })
  }
};

exports.user_logout = (req, res, next) => {
    if (req.session) {
      // delete session object
      req.session.destroy( (err) => {
        if (err) {
          return next(err)
        } else {
          return res.redirect('/');
        }
      })
    }
  }

// Display User create form on GET.
exports.user_create_get = (req, res) => {
    res.render('user_form', { title: 'Sign Up'});
};

// // Post route for creating a new user
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
                    // Create a User object with escaped and trimmed data.
                    // Note that User model hashed the user password before persisting to the database
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


exports.getUser = (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
}

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