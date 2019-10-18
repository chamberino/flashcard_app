const Card = require('../models/card');
var Deck = require('../models/deck');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display list of all Cards. ??? for specific deck
exports.card_list = function(req, res) {

    Card.find()
    .populate('deck')
    .exec(function (err, list_cards) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('card_list', { title: 'Card List', card_list: list_cards });
    });
    
};

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
      res.render('card_detail', { title: 'Copy: '+card.deck.title, card: card});
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
            Deck.findById(req.params.id)
                .exec(function (err, deck) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.json({ title: 'Create Card', deck: deck, selected_deck: card.deck._id , errors: errors.array(), card: card });
            });
            return;
        }
        else {
            // Data from form is valid.
            card.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(card.url);
                });
        }
    }
];

// Display Card delete form on GET.
exports.card_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Card delete GET');
};

// Handle Card delete on POST.
exports.card_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Card delete POST');
};

// Display Card update form on GET.
exports.card_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Card update GET');
};

// Handle card update on POST.
exports.card_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Card update POST');
};