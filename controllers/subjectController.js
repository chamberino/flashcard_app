const Subject = require('../models/subject');

// Display list of all Genre.
exports.subject_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject list');
};

// Display detail page for a specific Subject.
exports.subject_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject detail: ' + req.params.id);
};

// Display Subject create form on GET.
exports.subject_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject create GET');
};

// Handle Subject create on POST.
exports.subject_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject create POST');
};

// Display Subject delete form on GET.
exports.subject_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject delete GET');
};

// Handle Subject delete on POST.
exports.subject_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject delete POST');
};

// Display Subject update form on GET.
exports.subject_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject update GET');
};

// Handle Subject update on POST.
exports.subject_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject update POST');
};