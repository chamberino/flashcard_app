var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
const User = require('../models/user');
const Card = require('../models/card');
const Subject = require('../models/subject');
var Deck = require('../models/deck');

const db = mongoose.connection;

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

// POST request to create deck
router.post('/deck/create', mid.auth, deck_controller.deck_create_post) ///****/

// Post request to create deck with cards
router.post('/deck/createdeckwithcards', deck_controller.deck_createWithCard_post)

// GET request for one Deck.
router.get('/deck/:id', deck_controller.deck_detail);   ///****/

// POST request to delete Deck.
router.delete('/deck/:id/delete', mid.auth, deck_controller.deck_delete_post);  ///****/

// POST request to update Deck.
router.put('/deck/:id/update', deck_controller.deck_update_put);  ///****/

router.put('/deck/:id/updatedeckwithcards', deck_controller.deck_updateWithCards_put);  ///in progress

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

// GET request for list of subjects via req.params.id
router.get('/subjects/search', subject_controller.subject_search);     ///****/

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

router.delete('/deletetokens', async function(req, res, next) {
    try { 
        db.collection('sessions').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
})

router.delete('/deleteusers', async function(req, res, next) {
    try { 
        db.collection('users').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
})

router.delete('/deletedecks', async function(req, res, next) {
    try { 
        db.collection('decks').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
})

router.delete('/deletecards', async function(req, res, next) {
    try { 
        db.collection('cards').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
})

router.delete('/deletesubjects', async function(req, res, next) {
    try { 
        db.collection('subjects').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
})

router.delete('/cleardatabase', [

    async function(req, res, next) {
        try { 
            db.collection('users').drop()
                if (!res) {
                    var err = new Error('Something went wrong');
                    err.status = 404;
                    return next(err)
                } 
                    console.log('Successfully deleted')
                    next()
            }
        catch (err) {
            next(err)
            }
    },

    async function(req, res, next) {
    try { 
        db.collection('tokens').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                console.log('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
},

async function(req, res, next) {
    try { 
        db.collection('decks').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                console.log('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
},

async function(req, res, next) {
    try { 
        db.collection('cards').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                console.log('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
},

async function(req, res, next) {
    try { 
        db.collection('subjects').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                console.log('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
},

async function(req, res, next) {
    try { 
        db.collection('sessions').drop()
            if (!res) {
                var err = new Error('Something went wrong');
                err.status = 404;
                return next(err)
            } 
                res.json('Successfully deleted')
                next()
        }
    catch (err) {
        next(err)
        }
}

], (req, res) => {
    res.json('successfully cleared db')
})

router.get('/getperson/:id',  async function(req, res, next) {
    // const id = mongoose.Types.ObjectId(req.params.id);
    const id = req.params.id;
    console.log(typeof id)
    try {
        deck = await Deck.find({"user": "5dbb595b45a2ef0e1752b843" })
        if (deck == null) {
            var err = new Error('Deck not found');
            err.status = 404;
            return next(err);
        } else { 
        res.json(deck)
        }
    } catch(err) {
        next(err)
    }
})

router.get('/getcardids', [
    async function(req, res, next) {
        try {
            const cards = await Card.find({}, '_id')
            if (cards == null) {
                var err = new Error('Cards not found');
                err.status = 404;
                return next(err);
            }
            req.cards = cards
            next()
        } catch(err) {
            next(err)
        }
    }, 
    (req, res, next) => {
        cardArray = req.cards.map(card=>card._id)
        res.json(cardArray)}
])

module.exports = router;

