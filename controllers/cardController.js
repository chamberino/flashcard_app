const Card = require('../models/card');

// Display list of all Cards. ??? for specific deck
exports.card_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Card list');
};

// Display detail page for a specific Card.
exports.card_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Card detail: ' + req.params.id);
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