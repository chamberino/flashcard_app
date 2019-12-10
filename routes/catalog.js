var express = require('express');
const { check,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var router = express.Router();
const { sanitizeBody } = require('express-validator');
const { auth } = require('../middleware/index');
require('dotenv').config();

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

// GET request for searching users, subjects, and decks
router.get('/decksearch/:category/:term', deck_controller.deck_search)

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





const refreshTokens = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTU0ZDFhOGQ3ODJhYTQ4NWEyNWYzZiIsImlhdCI6MTU3MjI5NjIzMn0.cG6Mq2BSC2f9OFSAhOGd7m1FFJej2MLaCcLbG6G7YBo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVAcC5jb20iLCJpYXQiOjE1NzEyOTgyNDF9.nCqkSAOus_GB3ulnmX2XCTpPT_Cv6m7WyBNsabOU2vw']

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken( { id: user._id } );
        res.json({ accessToken: accessToken });
    })
})


// Tutorial on JWT (JSON Web Tokens)
// https://www.youtube.com/watch?v=mbsmsi7l3r4&feature=youtu.be
router.post('/user/login', [
    check('email')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Email required'),
    check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Password required'),
  ], (req, res, next) => {
      // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `forEach()` method to push a list of error messages received from 
      // Mongoose validation to errorMessages array.
      const errorMessages = [];
          errors.array().forEach(error => errorMessages.push(error.msg))
          return res.json(errorMessages)
    } else {
      User.findOne({email: req.body.email})
      .then((user)=>{
        if (!user) {        
          const errorMessages = [];
          errorMessages.push("User not found")
          return res.json(errorMessages)
        }
        if (user) {
          bcrypt.compare(req.body.password, user.password, function(error, result) {
            if (result === true) {
              token = generateAccessToken({ id: user._id })
              refreshToken = generateRefreshToken({ id: user._id })
            //   jwt.sign(
            //     { id: user._id },
            //     process.env.ACCESS_TOKEN_SECRET,
            //     { expiresIn: '45m' },
            //     // callback
            //     (err, token) => {
            //       if(err) {
            //         res.json(err)
            //       } 
            //       // req.session.token = token;
            //       res.json({                  
            //         token,
            //         refreshToken: refreshToken,
            //         test:'test',
            //         user: {
            //           id: user._id,
            //           name: user.name,
            //           email: user.email
            //         }
            //       })
            //     }
            // )  
            req.session.refreshToken = refreshToken;
            console.log(req.session.refreshToken)
            res.json({token,
                      refreshToken: refreshToken,
                      test:'test',
                      user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                      }
                    })
            } else {
              const errorMessages = [];
              errorMessages.push("Credentials don't match")
              return res.json(errorMessages)
            }
        })
        }
      }).catch((error) => {  
        // catch any other errors and pass errors to global error handler
        next(error);
    });
    };      
  });


// Returns an access token which expires after 10 minutes
function generateAccessToken(user) {
  //  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m'})
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}





// const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


router.get('/logout', auth_controller.user_logout)

// // Post route for creating a new user
router.post('/user/create', user_controller.user_create_post);


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


module.exports = router;

