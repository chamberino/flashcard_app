const Card = require('../models/card');
var mongoose = require('mongoose');

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
    res.send('NOT IMPLEMENTED: Card create GET');
};

// Handle Card create on POST.
exports.card_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Card create POST');
};

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