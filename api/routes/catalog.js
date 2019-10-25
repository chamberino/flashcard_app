var express = require('express');
var router = express.Router();

var Deck = require('../models/deck');
var mongoose = require('mongoose');
const { body,check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Require controller modules.
var deck_controller = require('../controllers/deckController');
var user_controller = require('../controllers/userController');
var subject_controller = require('../controllers/subjectController');
var card_controller = require('../controllers/cardController');
var auth_controller = require('../controllers/authController');
const mid = require('../middleware/index');

/// catalog.js contains the routes for all the URLs ///

/// DECK ROUTES ///

// GET catalog home page.
router.get('/', deck_controller.index);

// GET request for list of all Deck items.
router.get('/decks', deck_controller.deck_list);

// GET request for creating a Deck. NOTE This must come before routes that display Deck (uses id).
router.get('/deck/create', deck_controller.deck_create_get);

// POST request for creating a Deck. NOTE This must come before routes that display Deck (uses id).
// router.post('/deck/create', [
//     check('title')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Please enter a class title'),
//       check('_id')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('User not recognized. Please sign in again.')
//   ], (req, res, next) => {
//       // Attempt to get the validation result from the Request object.
//     const errors = validationResult(req);
//     // If there are validation errors...
//     if (!errors.isEmpty()) {
//         // Use the Array `map()` method to get a list of error messages.
//         const errorMessages = errors.array().map(error => error.msg);
//         // Create custom error with 400 status code
//         res.status(400);
//         return res.json(errorMessages);
//     } else {
//         Deck.create(req.body)
//             .then((course)=>{
//                 if (course) {
//                     res.status(400);
//                     const errorMessages = [];
//                     errorMessages.push("This course already exists")
//                     return res.json(errorMessages);
//                 } else {
//                     res.location(`/decks/${course.id}`);                        
//                     res.status(201)                    
//                     res.json({deck: 100});  
//                 }
//             }).catch((error)=> {  // check for errors within body
//                 if (error.name === "SequelizeValidationError") {
//                     // Use Sequelize ORM to catch any validation errors
//                     // If errors exist, map over array of error objects and return array
//                     // with error messages
//                     const errorsArray = error.errors.map((error) => {
//                         return error.message;                
//                     })
//                     const err = new Error(errorsArray); //custom error message
//                     err.status = 400;
//                     next(err) // pass error along to global error handler
//                 } else {
//                     // catch any other errors and pass errors to global error handler
//                     next(error);
//                 }
//             });
//     };      
// });

router.post('/deck/create', mid.auth, deck_controller.deck_create_post)


// GET request for one Deck.
router.get('/deck/:id', deck_controller.deck_detail);

// POST request to delete Deck.
router.delete('/deck/:id/delete', mid.auth, function(req, res, next) {
//     const id = mongoose.Types.ObjectId(req.params.id);
const id = req.params.id;
    Deck.findById(id)
    .then((deck) => {
        // the deck creator is checked against the req.currentUser.id passed along from auth middleware
        // if(!(deck.userId == req.currentUser.id)) {
        //     res.status(403).json({ message: 'Users may only delete decks they created themselves' });
        // } else {
            if (!deck) { 
                const error = new Error('Cannot find the requested resource to update'); // custom error message
                error.status = 400;
                next(error); // catch any other errors and pass errors to global error handler
            } else { // delete matched deck
                return deck.remove()
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
        // }
    }).catch((error) => {  
        // catch any other errors and pass errors to global error handler
        next(error);
    });
});

// router.delete('/deck/:id/delete', mid.auth, function(req, res, next) {
//     //     const id = mongoose.Types.ObjectId(req.params.id);
//     const id = req.params.id;
//         Deck.findById(id)
//         .then((deck) => {
//             // the deck creator is checked against the req.currentUser.id passed along from auth middleware
//             // if(!(deck.userId == req.currentUser.id)) {
//             //     res.status(403).json({ message: 'Users may only delete decks they created themselves' });
//             // } else {
//                 if (!deck) { 
//                     const error = new Error('Cannot find the requested resource to update'); // custom error message
//                     error.status = 400;
//                     next(error); // catch any other errors and pass errors to global error handler
//                 } else { // delete matched deck
//                     return deck.remove()
//                     .then((deck)=>{
//                         if (!deck) { 
//                             const error = new Error('There was a problem deleting the deck'); // custom error message
//                             error.status = 400;
//                             next(error);
//                         } else {
//                         res.status(204).end();
//                         }
//                     }).catch((error) => {
//                         // catch any other errors and pass errors to global error handler
//                         next(error);
//                     });
//                 }
//             // }
//         }).catch((error) => {  
//             // catch any other errors and pass errors to global error handler
//             next(error);
//         });
//     });

// GET request to update Deck.
router.get('/deck/:id/update', deck_controller.deck_update_get);

// POST request to update Deck.
router.post('/deck/:id/update', deck_controller.deck_update_post);


// USER ROUTES ///

// GET PROFILE
router.get('/profile', user_controller.user_profile);

// // GET LOGOUT
// router.get('/user/logout', user_controller.user_logout);

// // GET LOGIN
router.get('/user/login', mid.loggedOut, user_controller.user_login_get);

// // POST LOGIN
router.post('/user/login', auth_controller.user_login_post);

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', mid.loggedOut, user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

/// SUBJECT ROUTES ///

// GET request for creating a Subject. NOTE This must come before route that displays Subject (uses id).
router.get('/subject/create', mid.auth, subject_controller.subject_create_get);

//POST request for creating Subject.
router.post('/subject/create', mid.auth, subject_controller.subject_create_post);

// GET request to delete Subject.
router.get('/subject/:id/delete', subject_controller.subject_delete_get);

// POST request to delete Subject.
router.post('/subject/:id/delete', subject_controller.subject_delete_post);

// GET request to update Subject.
router.get('/subject/:id/update', subject_controller.subject_update_get);

// POST request to update Subject.
router.post('/subject/:id/update', subject_controller.subject_update_post);

// GET request for one Subject.
router.get('/subject/:id', subject_controller.subject_detail);

// GET request for list of all Subject.
router.get('/subjects', subject_controller.subject_list);

/// CARD ROUTES ///

// get request for creating card using decks id
router.get('/deck/:id/create', card_controller.card_create_get_byID);

// post route for creating card using decks id
router.post('/deck/:id/create', card_controller.card_create_post);

// GET request to delete Card.
router.get('/card/:id/delete', card_controller.card_delete_get);

// DELETE request to delete Card.
router.delete('/card/:id/delete', mid.auth, card_controller.card_delete_post);

// GET request to update Card.
router.get('/card/:id/update', card_controller.card_update_get);

// POST request to update Card.
router.put('/card/:id/update', card_controller.card_update_post);

// GET request for one Card.
router.get('/card/:id', card_controller.card_detail);

router.get('/getUser', mid.auth, auth_controller.getUser)

module.exports = router;

