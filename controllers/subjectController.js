const Subject = require('../models/subject');
const Deck = require('../models/deck');
const async = require('async');
const mongoose = require('mongoose');
const validator = require('express-validator');


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

// Display list of all Subjects.
exports.subject_test = (req, res, next) => {
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
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        subject: function(callback) {
            Subject.findById(id)
              .exec(callback);
        },

        subject_decks: function(callback) {
            Deck.find({ 'subject': id })
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
        console.log('subject: ' + results.subject + 'subject_decks: ' + results.subject_decks)
        res.render('subject_detail', { title: 'Subject Detail', subject: results.subject, subject_decks: results.subject_decks } );
    });
};


// Display Subject create form on GET.
exports.subject_create_get = function(req, res) {
    res.render('subject_form', { title: 'Create Subject' });
};

// Handle Subject create on POST.
exports.subject_create_post = [
   
    // Validate that the name field is not empty.
    validator.body('name', 'Subject name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var subject = new Subject(
        { name: req.body.name }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('subject_form', { title: 'Create Subject', subject: subject, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Subject with same name already exists.
        Subject.findOne({ 'name': req.body.name })
          .exec( function(err, found_subject) {
             if (err) { return next(err); }
  
             if (found_subject) {
               // Subject exists, redirect to its detail page.
               res.redirect(found_subject.url);
             }
             else {
  
               subject.save(function (err) {
                 if (err) { return next(err); }
                 // Subject saved. Redirect to subject detail page.
                 res.redirect(subject.url);
               });
  
             }
  
           });
      }
    }
  ];

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