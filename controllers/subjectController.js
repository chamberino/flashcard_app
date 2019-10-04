const Subject = require('../models/subject');
const Book = require('../models/deck');
const async = require('async');

// Display list of all Subjects.
exports.subject_list = (req, res, next) => {
    Subject.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_subjects) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('subject_list', { title: 'Subject List', subject_list: list_subjects });
    });
};

// Display detail page for a specific Subject.
exports.subject_detail = function(req, res, next) {
    async.parallel({
        subject: function(callback) {
            Subject.findById(req.params.id)
              .exec(callback);
        },

        subject_decks: function(callback) {
            Deck.find({ 'subject': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.subject==null) { // No results.
            var err = new Error('Subject not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('subject_detail', { title: 'Subject Detail', subject: results.subject, subject_decks: results.subject_decks } );
    });
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