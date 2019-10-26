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
      // Successful, so render.
      res.json({card: card, cardId: card._id, userId: card.deck.user, deckId: card.deck._id});
    })
};

// Display card create form on GET.
exports.card_create_get = function(req, res) {
    Deck.find({},'title')
    .exec(function (err, decks) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('card_form', {title: 'Create Card', deck_list: decks});
    });
    
};

// Display card create form on GET using id param.
exports.card_create_get_byID = function(req, res, next) {
    Deck.findById(req.params.id)
    .exec(function (err, decks) {
      if (err) { 
        const error = new Error('Could not find associated deck'); // custom error message
        error.status = 404;
        return next(error) // pass error along to global error handler
        }
      // Successful, so render.
      res.json({title: 'Create Card', deck_list: decks});
    });
    
};

exports.card_create_post = [

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

        // Create a BookInstance object with escaped and trimmed data.
        var card = new Card(
          { 
            deck: req.params.id,
            question: req.body.question,
            hint: req.body.hint,
            answer: req.body.answer
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            const errorMessages = errors.array().map(error => error.msg);
            res.status(400);
            return res.json(errorMessages);
            // Deck.findById(req.params.id)
            //     .exec(function (err, deck) {
            //         if (err) { return next(err); }
            //         // Successful, so render.
            //         // res.json({ newerrortest:errorMessages ,title: 'Create Card', deck: deck, selected_deck: card.deck._id , errors: errors.array(), card: card });
            // });
            // return;
        }
        else {
            // Data from form is valid.
            card.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   return res.status(201).json({id: card._id, status: 201});                
                });
        }
    }
];

// Display Card delete form on GET.
exports.card_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Card delete GET');
};

// Handle Card delete on POST.
exports.card_delete_post = function(req, res, next) {
        const id = 
    mongoose.Types.ObjectId(req.params.id);
    // const id = req.body.id
        Card.findById(id)
        .then((card) => {
            // the deck creator is checked against the req.currentUser.id passed along from auth middleware
            // if(!(deck.userId == req.currentUser.id)) {
            //     res.status(403).json({ message: 'Users may only delete decks they created themselves' });
            // } else {
                if (!card) { 
                    const error = new Error('Cannot find the requested resource to update'); // custom error message
                    error.status = 400;
                    console.log(error)
                    next(error); // catch any other errors and pass errors to global error handler
                } else { // delete matched deck
                    return card.remove()
                    .then((card)=>{
                        console.log(card)

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
            // }
        }).catch((error) => {  
            // catch any other errors and pass errors to global error handler
            next(error);
        });
    }

// Display Card update form on GET.
exports.card_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Card update GET');
};

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

        // Create a BookInstance object with escaped and trimmed data.

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
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
            Card.findOneAndUpdate(req.params.id, card, {upsert:false}, function(err,doc) {
                if(err) {
                    res.json([err])
                } else {
                    res.status(204).end();
                }
            })
                // .then((card) => {
                // // the deck creator is checked against the req.currentUser.id passed along from auth middleware
                // // if(!(deck.userId == req.currentUser.id)) {
                // //     res.status(403).json({ message: 'Users may only delete decks they created themselves' });
                // // } else {
                //     if (!card) { 
                //         const error = new Error('Cannot find the requested resource to update'); // custom error message
                //         error.status = 400;
                //         console.log(error)
                //         next(error); // catch any other errors and pass errors to global error handler
                //     } else { // update matched deck
            
            // Data from form is valid.
        //     card.update(card)
        //         .then((card) => { 
        //             if (!card){
        //                 const error = new Error('There was a problem posting the flashcard'); // custom error message
        //                 error.status = 400;
        //                 next(error); // pass error along to global error handler
        //             } else {
        //                 res.status(204).end();
        //             }
        //         }).catch((error)=>{
        //             // Use Sequelize ORM to catch any validation errors
        //             if (error.name === "SequelizeValidationError") {
        //                 const errorsArray = error.errors.map((error) => {
        //                     return error.message;                
        //                 })
        //                 const err = new Error(errorsArray);
        //                 error.status = 400;
        //                 next(err);
        //             } else {
        //                 next(error); // catch any other errors and pass errors to global error handler
        //             }
        //         });
        //     }
        // }).catch((error)=>{
        //     next(error); // catch any other errors and pass errors to global error handler
        // })
        }
    }
];