var express = require('express');
var router = express.Router();

// Require controller modules.
var deck_controller = require('../controllers/deckController');
var user_controller = require('../controllers/userController');
var subject_controller = require('../controllers/subjectController');
var card_controller = require('../controllers/cardController');
var test_controller = require('../controllers/testController');
const mid = require('../middleware/index');

/// DECK ROUTES ///

// GET catalog home page.
router.get('/', deck_controller.index);

// TEST
router.get('/test', test_controller.test_route);

// GET request for creating a Deck. NOTE This must come before routes that display Deck (uses id).
router.get('/deck/create', mid.requiresLogin, deck_controller.deck_create_get);

// POST request for creating Deck.
router.post('/deck/create', deck_controller.deck_create_post);

// GET request to delete Deck.
router.get('/deck/:id/delete', deck_controller.deck_delete_get);

// POST request to delete Deck.
router.post('/deck/:id/delete', deck_controller.deck_delete_post);

// GET request to update Deck.
router.get('/deck/:id/update', deck_controller.deck_update_get);

// POST request to update Deck.
router.post('/deck/:id/update', deck_controller.deck_update_post);

// GET request for one Deck.
router.get('/deck/:id', deck_controller.deck_detail);

// GET request for list of all Deck items.
router.get('/decks', deck_controller.deck_list);


// USER ROUTES ///

// GET PROFILE
router.get('/profile', user_controller.user_profile);

// GET LOGOUT
router.get('/user/logout', user_controller.user_logout);

// GET LOGIN
router.get('/user/login', mid.loggedOut, user_controller.user_login_get);

// POST LOGIN
router.post('/user/login', user_controller.user_login_post);

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
router.get('/subject/create', subject_controller.subject_create_get);

//POST request for creating Subject.
router.post('/subject/create', subject_controller.subject_create_post);

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
router.get('/deck/:id/create', mid.requiresLogin, card_controller.card_create_get_byID);

// post route for creating card using decks id
router.post('/deck/:id/create', card_controller.card_create_post);


// GET request for creating a Card. NOTE This must come before route that displays Card (uses id).
router.get('/card/create', card_controller.card_create_get);

// POST request for creating Card. 
router.post('/card/create', card_controller.card_create_post);

// GET request to delete Card.
router.get('/card/:id/delete', card_controller.card_delete_get);

// POST request to delete Card.
router.post('/card/:id/delete', card_controller.card_delete_post);

// GET request to update Card.
router.get('/card/:id/update', card_controller.card_update_get);

// POST request to update Card.
router.post('/card/:id/update', card_controller.card_update_post);

// GET request for one Card.
router.get('/card/:id', card_controller.card_detail);

// GET request for list of all Card.
router.get('/cards', card_controller.card_list);

module.exports = router;

