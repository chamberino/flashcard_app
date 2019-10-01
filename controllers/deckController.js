const Deck = require('../models/deck');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all decks.
exports.deck_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Deck list');
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