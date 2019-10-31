var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
const Card = require('../models/card');
var Deck = require('../models/deck');

// Require controller modules.
var deck_controller = require('../controllers/deckController');
var user_controller = require('../controllers/userController');
var subject_controller = require('../controllers/subjectController');
var card_controller = require('../controllers/cardController');
var auth_controller = require('../controllers/authController');
const mid = require('../middleware/index');

/// catalog.js contains the routes for all the API endpoints ///

/// DECK ROUTES ///

// GET home page. Gets a count of all the Models in our DB.
router.get('/', deck_controller.index);

// GET request for list of all Deck items.
router.get('/decks', deck_controller.deck_list);   ///****/

router.post('/deck/create', mid.auth, deck_controller.deck_create_post) ///****/

// GET request for one Deck.
router.get('/deck/:id', deck_controller.deck_detail);   ///****/

// POST request to delete Deck.
router.delete('/deck/:id/delete', mid.auth, deck_controller.deck_delete_post);  ///****/

// POST request to update Deck.
router.put('/deck/:id/update', deck_controller.deck_update_put);  ///****/

// USER ROUTES ///

// POST request to delete User and all associated records
router.delete('/user/:id/delete', mid.auth, user_controller.user_delete_post) ///****/

// POST request to update User.
router.put('/user/:id/update', user_controller.user_update_post);   /// NOT IMPLEMENTED /////

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);    ///****/

// GET request for list of all Users.
router.get('/users', user_controller.user_list);    ///****/

/// SUBJECT ROUTES ///

//POST request for creating Subject.
router.post('/subject/create', mid.auth, subject_controller.subject_create_post);  /// HAS SOME ISSUES (SEE NOTES) /// 

// POST request to delete Subject.
router.delete('/subject/:id/delete', subject_controller.subject_delete_post);   /// NOT IMPLEMENTED /////

// POST request to update Subject.
router.post('/subject/:id/update', subject_controller.subject_update_post);    /// NOT IMPLEMENTED /////

// GET request for one Subject.
router.get('/subject/:id', subject_controller.subject_detail);   ///****/

// GET request for list of all Subject.
router.get('/subjects', subject_controller.subject_list);     ///****/

/// CARD ROUTES ///

// post route for creating card using decks id
router.post('/deck/:id/create', card_controller.card_create_post);    ///****/

// GET request for one Card.
router.get('/card/:id', card_controller.card_detail);    ///*****/

// DELETE request to delete Card.
router.delete('/card/:id/delete', mid.auth, card_controller.card_delete_post);     ///****/

// POST request to update Card.
router.put('/card/:id/update', card_controller.card_update_put);    ///****/

router.get('/getUser', mid.auth, auth_controller.getUser)

module.exports = router;

