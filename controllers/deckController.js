var Deck = require('../models/deck');
var User = require('../models/user');
var Subject = require('../models/subject');
var Card = require('../models/card');

var async = require('async');

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
        res.render('index', { title: 'FlashCard Home', error: err, data: results });
    });
};
// Display list of all decks.
exports.deck_list = function(req, res) {
    
    Deck.find({}, 'title user')
    .populate('user')
    .exec(function (err, list_decks) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('deck_list', { title: 'List of Decks', deck_list: list_decks });
    });

};

// Display detail page for a specific deck.
exports.deck_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck detail: ' + req.params.id);
};

// Display deck create form on GET.
exports.deck_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck create GET');
};

// Handle deck create on POST.
exports.deck_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck create POST');
};

// Display deck delete form on GET.
exports.deck_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck delete GET');
};

// Handle deck delete on POST.
exports.deck_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck delete POST');
};

// Display deck update form on GET.
exports.deck_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update GET');
};

// Handle deck update on POST.
exports.deck_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck update POST');
};