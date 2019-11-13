var Deck = require('../models/deck');
var User = require('../models/user');
var Subject = require('../models/subject');
var Card = require('../models/card');
var mongoose = require('mongoose');
const { check, checkIf, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

mongoose.Promise = global.Promise;
var async = require('async');

// Route is currently not being used by client
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
        if (err) {
            const error = new Error('There was an error retrieving the flashcard data'); //throw custom error    
            error.status = 400;
            next(error); // pass error along to global error handler
        }
        res.json({error: err, data: results });
    });
};

// Display list of all decks.
exports.deck_list = function(req, res, next) {
    Deck.find({}, 'title user')
    .populate('user', '_id first_name last_name')
    .exec(function (err, deck_list) {
      if (err) { 
            // Log error and set status code if there's a problem retrieving the decks
            const error = new Error('There was an error retrieving the decks'); //throw custom error    
            error.status = 400;
            next(error); // pass error along to global error handler
       }
      //Successful, so send data
      res.json({deck_list});
    });
};

// // Display detail page for a specific deck.
// exports.deck_detail = function(req, res, next) {
//         const id = mongoose.Types.ObjectId(req.params.id);
    
//         async.parallel({
//             deck: function(callback) {
    
//                 Deck.findById(id)
//                   .populate('user', '_id first_name last_name')
//                   .populate('subject')
//                   .exec(callback);
//             },
//             card: function(callback) {
    
//               Card.find({ 'deck': id })
//               .exec(callback);
//             },
//         }, function(err, results) {
//             if (err) { return next(err); }
//             if (results.deck == null) { // No results.
//                 var err = new Error('Deck not found');
//                 err.status = 404;
//                 return next(err);
//             }
//             // Successful, so send data.
//             res.json({ title: results.deck.title, deck: results.deck, cards: results.card });
//         });
//     };


// Display detail page for a specific deck.
exports.deck_detail = [
    async function(req, res, next) {
        const id = mongoose.Types.ObjectId(req.params.id);
        try {
            const deck = await Deck.findById(id)
            .populate('user', '_id first_name last_name')
            .populate('subject')
            if (deck == null) {
                var err = new Error('Deck not found');
                err.status = 404;
                return next(err);
            }
            req.deck = deck
            next()
        } catch(err) {
            next(err)
        }
    }, async function(req, res, next) {
        const id = mongoose.Types.ObjectId(req.params.id);
        try {
            const cards = await Card.find({ 'deck': id })
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
    (req, res, next) => {res.json({title: req.deck.title, deck: req.deck, cards: req.cards})}
]

    // getDeck(id).then((deck)=>res.json(deck.title))

   

    // async function getCard() {
    //         await Card.findById({ 'deck': id })
    //             .exec();
    //     }

    //     }, function(err, results) {
    //         if (err) { return next(err); }
    //         if (results.deck == null) { // No results.
    //             var err = new Error('Deck not found');
    //             err.status = 404;
    //             return next(err);
    //         }
            // Successful, so send data.
            // res.json({ title: results.deck.title, deck: results.deck, cards: results.card });

    // };

// Handle post deck route
// Request body should be formatted like this...
//
exports.deck_create_post = [
        check('title')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('Title required'),
          check('user')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('User not recognized. Please sign in again.'),
          check('subject')
          .exists({ checkNull: true, checkFalsy: true })
          .isArray({min:1})
          .withMessage('Subject required'),
        sanitizeBody('title').escape(),
(req, res, next) => {
    const errors = validationResult(req);
    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        // Create custom error with 400 status code
        res.status(400);
        return res.json(errorMessages);
    } else {
    Deck.create(req.body)
            .then((deck)=>{
                if (!deck) {
                    const errorMessages = [];
                    errorMessages.push("This deck already exists")
                    return res.status(400).json(errorMessages);
                } else {
                    // res.location(`/decks/${deck._id}`);                        
                    return res.status(201).json({id: deck._id, status: 201});                
                }
            }).catch((error)=> {  // check for errors within body
                if (error) {
                    // catch any other errors and pass errors to global error handler
                    next(error);
                }
            });
        };
    }
]

// exports.deck_createWithCard_post = [
//     check('title')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('Title required'),
//       check('user')
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('User not recognized. Please sign in again.'),
//       check('subject')
//       .exists({ checkNull: true, checkFalsy: true })
//       .isArray({min:1})
//       .withMessage('Subject required'),
//       check('cards.*.question')  
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('A question is required for each card.'),
//       check('cards.*.answer')  
//       .exists({ checkNull: true, checkFalsy: true })
//       .withMessage('An answer is required for each card.'),

//     sanitizeBody('title').escape(),
//     sanitizeBody('cards.*.question').escape(),
//     sanitizeBody('cards.*.answer').escape(),
// (req, res, next) => {
//     console.log(req.body)
// const errors = validationResult(req);
// // If there are validation errors...
// if (!errors.isEmpty()) {
//     // Use the Array `map()` method to get a list of error messages.
//     const errorMessages = errors.array().map(error => error.msg);
//     console.log(errorMessages)
//     // Create custom error with 400 status code
//     res.status(400);
//     return res.json(errorMessages);
// } else {
// Deck.create(req.body)
//         .then((deck)=>{
//             if (!deck) {
//                 const errorMessages = [];
//                 errorMessages.push("There was a problem creating the deck")
//                 return res.status(400).json(errorMessages);
//             } else {
//                 // res.location(`/decks/${deck._id}`);    
//                 console.log(`Deck ${deck.id} successfully created`)                    
//                 req.deckId = deck.id;
//                 next()
//             }
//         }).catch((error)=> {  // check for errors within body
//             if (error) {
//                 // catch any other errors and pass errors to global error handler
//                 next(error);
//             }
//         });
//     };
// }, 

// (req, res, next) => {
//     console.log(req.deckId)
//     req.body.cards.map((card)=>{
//         card.deck = req.deckId
//     })    
//         Card.insertMany(req.body.cards)
//         .then(cards => {
//             return res.status(201).json({id: req.deckId, status: 201});  
//         })
//         .catch(err => {
//             console.log(err)
//             res.json([err.message]);
//         });
//     }

// ]

// Delete Deck and all associated cards
exports.deck_delete_post = function(req, res, next) {
    const id = req.params.id;
        Deck.findById(id)
        .then((deck) => {
                if (!deck) { 
                    const error = new Error('Cannot find the requested resource to update'); // custom error message
                    error.status = 400;
                    next(error); // catch any other errors and pass errors to global error handler
                } else if (!(deck.user == req.user.id)) {
                    const error = new Error('Users may only delete decks they created themselves'); // custom error message
                    error.status = 403;
                    next(error); // catch any other errors and pass errors to global error handler
                } else { // delete matched deck
                    return deck.remove()
                    .then((deck)=>{
                        if (!deck) { 
                            const error = new Error('There was a problem deleting the deck'); // custom error message
                            error.status = 400;
                            next(error);
                        } else {
                            // delete all cards associated with deck
                            Card.deleteMany({ 'deck': id, 'user':req.user.id }, function(err, doc) {
                                if (err) {
                                    return res.json([err])
                                } 
                            })
                            .then(deck => console.log(deck))
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
    }

// Handle deck update on POST.
exports.deck_update_put = [

    // Validate fields.
    check('title')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('Title required'),
          check('user')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('User not recognized. Please sign in again.'),
          check('subject')
          .exists({ checkNull: true, checkFalsy: true })
          .isArray({min:1})
          .withMessage('Subject required'),
        sanitizeBody('title').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        }   else {
            Deck.findByIdAndUpdate(req.params.id, req.body, {upsert:false}, function(err,doc) {
                if(err) {
                    res.json([err])
                } else {
                    res.status(204).end();
                }
            })
        }
    }
];

// Handle deck update on POST.
exports.deck_updateWithCards_put = [
    // Validate fields.
    check('title')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('Title required'),
    check('user')
          .exists({ checkNull: true, checkFalsy: true })
          .withMessage('User not recognized. Please sign in again.'),
    check('subject').custom(subject => {
        if ((Array.isArray(subject) && subject.length > 0) || subject ===false ) {                        
            return true
        } else {
            console.log('error happening in the subject')
            throw new Error('subject required')
        }
    }),
    check('otherSubjectValue').custom(otherSubjectValue => {
        if (otherSubjectValue === false) {            
            return true
        } 
        if ((typeof otherSubjectValue === 'string' && otherSubjectValue.length > 0)) {
            sanitizeBody('otherSubjectValue').escape()
            return true
        } else {
            throw new Error('subject required')
        }
    }),
    check('otherSubject')
        .exists({ checkNull: false, checkFalsy: false })
        .isBoolean(),
        sanitizeBody('title').escape(),
    check('cards.*.question')  
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('A question is required for each card.'),
    check('cards.*.answer')  
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('An answer is required for each card.'),

        sanitizeBody('title').escape(),
        sanitizeBody('subject').escape(),
        sanitizeBody('cards.*.question').escape(),
        sanitizeBody('cards.*.answer').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {        
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        }  else {
            // Deck.findByIdAndUpdate(req.params.id, req.body, {upsert:false}, function(err,doc) {
            //     if(err) {
            //         res.json([err])
            //     } else {
                console.log('PASSED VALIDATION', req.body)
                    next()
            //     }
            // }).catch((error)=>{
            //     if (error) {
            //         // catch any other errors and pass errors to global error handler
            //         next(error);
            //     }
            // })
        }
    },

    (req, res, next) => {
        if (req.body.otherSubject && req.body.otherSubjectValue.length > 0) {
            console.log('create new subject section')
                  // Create a subject object with escaped and trimmed data.
          var subject = new Subject(
            { name: req.body.otherSubjectValue }
          );
            // Check if Subject with same name already exists.
            Subject.findOne({ 'name': req.body.otherSubjectValue })
              .exec( function(err, found_subject) {
                 if (err) { return next(err); }
      
                 if (found_subject) {
                   // Subject exists, send message.
                   res.status(400);
                        const errorMessages = [];
                        errorMessages.push('Subject already exists')
                        return res.json(errorMessages);
                 }
                 else {
                   subject.save(function (err) {
                     if (err) { return next(err); }
                     // Subject saved. Redirect to subject detail page.                 
                     req.subjectId = subject._id;
                     next()
                   });
                }
          });
        } else {
            console.log('THE SUBJECT EXISTS')
            next();
        }
    },

    (req, res, next) => {
        console.log('req.subjectId is equal to undefined: ' , req.subjectId !== undefined)
        console.log('subjectId: ', req.subjectId)
        if (req.subjectId !== undefined) {
            const deckPayload = {
                title: req.body.title,
                user: req.body.user,
                subject: [req.subjectId]
            }
            console.log('deckpayload: ', deckPayload);

            Deck.findByIdAndUpdate(req.params.id, deckPayload, {upsert:false}, function(err,doc) {
                if(err) {
                    res.json([err])
                } else {
                next()
                    }
                }).catch((error)=>{
                    if (error) {
                        // catch any other errors and pass errors to global error handler
                        next(error);
                    }
                })
        } else {            
            const deckPayload = {
                title: req.body.title,
                user: req.body.user,
                subject: req.body.subject                
            }
            console.log('payload before updating deck: ', deckPayload)

            Deck.findByIdAndUpdate(req.params.id, deckPayload, {upsert:false}, function(err,doc) {
                if(err) {
                    console.log(err)
                    res.json([err])
                } else {
                    console.log('DECK HAS BEEN UPDATED')
                next()
                    }
                }).catch((error)=>{
                    if (error) {
                        // catch any other errors and pass errors to global error handler
                        next(error);
                    }
                })
        }
    },

    (req, res, next) => {
        console.log('line 483 deck has been added.')
        req.body.cards.map((card)=>{
            req.newCards = [];
            req.oldCards = []            
            card.deck = req.params.id;
            if (card.id === undefined) {
                req.newCards.push(card)
            }
            if (card.id !== undefined) {
                Card.findByIdAndUpdate(card.id, card, {upsert:false}, function(err,doc) {
                    if(err) {
                        res.json([err])
                    } else {
                        console.log(`Card ${card.id} successfully created`)                    
                    }
                })
            }
        })    
            Card.insertMany(req.newCards)
            .then(cards => {
                console.log('CARDS SUCCESSFULLY CREATED')
                return res.status(201).json({status: 201});  
            })
            .catch(err => {
                console.log(err)
                res.json([err.message]);
            });
        }

];

exports.deck_createWithCard_post = [
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Title required'),
    check('user')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('User not recognized. Please sign in again.'),
    check('subject').custom(subject => {
        if ((Array.isArray(subject) && subject.length > 0) || subject ===false ) {                        
            return true
        } else {
            console.log('error happening in the subject')
            throw new Error('subject required')
        }
    }),
    check('otherSubjectValue').custom(otherSubjectValue => {
        if (otherSubjectValue === false) {            
            return true
        } 
        if ((typeof otherSubjectValue === 'string' && otherSubjectValue.length > 0)) {
            return true
        } else {
            throw new Error('subject required')
        }
    }),
    check('otherSubject')
      .exists({ checkNull: false, checkFalsy: false })
      .isBoolean(),
    check('cards.*.question')  
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('A question is required for each card.'),
    check('cards.*.answer')  
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('An answer is required for each card.'),

    sanitizeBody('title').escape(),
    sanitizeBody('subject').escape(),
    sanitizeBody('cards.*.question').escape(),
    sanitizeBody('cards.*.answer').escape(),

// Process request after validation and sanitization.
(req, res, next) => {
const errors = validationResult(req);
// If there are validation errors...
if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    console.log(errorMessages)
    // Create custom error with 400 status code
    res.status(400);
    return res.json(errorMessages);
}  else  {
        next();
    }
}, (req, res, next) => {
    console.log(req.body)
    if (req.body.otherSubject) {
        console.log('create new subject section')
              // Create a subject object with escaped and trimmed data.
      var subject = new Subject(
        { name: req.body.otherSubjectValue }
      );
        // Check if Subject with same name already exists.
        Subject.findOne({ 'name': req.body.otherSubjectValue })
          .exec( function(err, found_subject) {
             if (err) { return next(err); }
  
             if (found_subject) {
               // Subject exists, send message.
               res.status(400);
                    const errorMessages = [];
                    errorMessages.push('Subject already exists')
                    return res.json(errorMessages);
             }
             else {
               subject.save(function (err) {
                 if (err) { return next(err); }
                 // Subject saved. Redirect to subject detail page.                 
                 req.subjectId = subject._id;
                 next()
               });
            }
      });
    } else {
        console.log('this subject exists')
        next();
    }
}, 

(req, res, next) => {
    console.log(req.subjectId !== undefined)
    console.log('subjectId: ', req.subjectId)
    if (req.subjectId !== undefined) {
    const deckPayload = {
        title: req.body.title,
        user: req.body.user,
        subject: [req.subjectId]
    }
    console.log('deckpayload: ', deckPayload);
    Deck.create(deckPayload)
        .then((deck)=>{
            if (!deck) {
                const errorMessages = [];
                errorMessages.push("There was a problem creating the deck")
                return res.status(400).json(errorMessages);
            } else {
                // res.location(`/decks/${deck._id}`);    
                console.log(`Deck ${deck.id} successfully created`)                    
                req.deckId = deck.id;
                next()
            }
        }).catch((error)=> {  // check for errors within body
            if (error) {
                // catch any other errors and pass errors to global error handler
                next(error);
            }
        });
    } else {
        const deckPayload = {
            title: req.body.title,
            user: req.body.user,
            subject: req.body.subject
        }
        Deck.create(deckPayload)
        .then((deck)=>{
            if (!deck) {
                const errorMessages = [];
                errorMessages.push("There was a problem creating the deck")
                return res.status(400).json(errorMessages);
            } else {
                // res.location(`/decks/${deck._id}`);    
                console.log(`Deck ${deck.id} successfully created`)                    
                req.deckId = deck.id;
                next()
            }
        }).catch((error)=> {  // check for errors within body
            if (error) {
                // catch any other errors and pass errors to global error handler
                next(error);
            }
        });
    }
},

(req, res, next) => {
    console.log(req.deckId)
    req.body.cards.map((card)=>{
        card.deck = req.deckId
    })    
        Card.insertMany(req.body.cards)
        .then(cards => {
            return res.status(201).json({id: req.deckId, status: 201});  
        })
        .catch(err => {
            console.log(err)
            res.json([err.message]);
        });
    }

]