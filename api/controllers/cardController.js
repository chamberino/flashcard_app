const Card = require('../models/card');
var Deck = require('../models/deck');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display detail page for a specific Card.
exports.card_detail = function(req, res, next) {
    const id = mongoose.Types.ObjectId(req.params.id);
    Card.findById(id)
    .populate('deck')
    .exec(function (err, card) {
      if (err) { return next(err); }
      if (card==null) { // No results.
          var err = new Error('Card not found');
          err.status = 404;
          return next(err);
        }
      res.json({card: card, cardId: card._id, userId: card.deck.user, deckId: card.deck._id});
    })
};

exports.card_create_post = [

    // Validate fields.
    body('question', 'Question must be specified').isLength({ min: 1 }).trim(),
    body('answer', 'Answer must be specified').isLength({ min: 1 }).trim(),
    
    // Sanitize fields.
    sanitizeBody('question').escape(),
    sanitizeBody('hint').escape(),
    sanitizeBody('answer').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        }
        else {
            const id = mongoose.Types.ObjectId(req.params.id);
            console.log(id)
            Deck.find(id)
                .then((deck) => {
                    if (!deck) {
                        res.status(400);
                        return res.json(["Could not find associated deck"]);
                    } else {
                        // Data from form is valid and an associated deck exists
                        // Create a BookInstance object with escaped and trimmed data.
                        var card = new Card(
                          { 
                            deck: id,
                            question: req.body.question,
                            hint: req.body.hint,
                            answer: req.body.answer
                           });
                        card.save(function (err) {
                            if (err) { return next(err); }
                            // Successful - redirect to new record.
                            return res.status(201).json({id: card._id, status: 201});                
                        });
                    }
                })
        }
    }
];


// Handle Card delete on POST.
exports.card_delete_post = function(req, res, next) {
        const id = mongoose.Types.ObjectId(req.params.id);
    // const id = req.body.id
        Card.findById(id)
        .populate('deck')
        .then((card) => {
            // the deck creator is checked against the req.currentUser.id passed along from auth middleware
            if(!(card.deck.user == req.user.id)) {
                res.status(403).json({ message: 'Users may only delete cards they created themselves' });
            } else {
                if (!card) { 
                    const error = new Error('Cannot find the requested resource to update'); // custom error message
                    error.status = 400;
                    next(error); // catch any other errors and pass errors to global error handler
                } else { // delete matched deck
                    return card.remove()
                    .then((card)=>{
                        if (!card) { 
                            const error = new Error('There was a problem deleting the card'); // custom error message
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
            }
        }).catch((error) => {  
            // catch any other errors and pass errors to global error handler
            next(error);
        });
    }

// Handle card update on POST.
exports.card_update_put = [

    // Validate fields.
    body('question', 'Question must be specified').isLength({ min: 1 }).trim(),
    body('hint', 'Hint must be specified').isLength({ min: 1 }).trim(),
    body('answer', 'Answer must be specified').isLength({ min: 1 }).trim(),
    
    // Sanitize fields.
    sanitizeBody('question').escape(),
    sanitizeBody('hint').escape(),
    sanitizeBody('answer').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
        }   else {
            const card =
          { 
            deck: req.body.deck,
            question: req.body.question,
            hint: req.body.hint,
            answer: req.body.answer
           }
            Card.findByIdAndUpdate(req.params.id, card, {upsert:false}, function(err,doc) {
                if(err) {
                    res.json([err])
                } else {
                    res.status(204).end();
                }
            })
        }
    }
];