const Subject = require('../models/subject');
const Deck = require('../models/deck');
const async = require('async');
const mongoose = require('mongoose');
const validator = require('express-validator');

// Display list of all primary Subjects.
exports.subject_list = (req, res, next) => {
    Subject.find({isPrimarySubject: true})
    .sort([['name', 'ascending']])
    .exec(function (err, list_subjects) {
      if (err) { return next(err); }
      res.json({ title: 'Subject List', subject_list: list_subjects });
    });
};

// Display list of ALL Subjects.
exports.subject_search = (req, res, next) => {
  Subject.find()
  .sort([['name', 'ascending']])
  .exec(function (err, list_subjects) {
    if (err) { return next(err); }
    res.json({ title: 'Subject List', subject_list: list_subjects });
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
        res.json( { subject: results.subject, subject_decks: results.subject_decks } );
    });
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
  
      // Create a subject object with escaped and trimmed data.
      var subject = new Subject(
        { name: req.body.name }
      );
  
      if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400);
        return res.json(errorMessages);
      }
      else {
        // Data from form is valid.
        // Check if Subject with same name already exists.
        Subject.findOne({ 'name': req.body.name })
          .exec( function(err, found_subject) {
             if (err) { return next(err); }
  
             if (found_subject) {
               // Subject exists, send message.
               res.status(400);
                    const errorMessages = [];
                    errorMessages.push('Subect already exists')
                    return res.json(errorMessages);
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

// Handle Subject delete on POST.
exports.subject_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject delete POST');
};

// Handle Subject update on POST.
exports.subject_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Subject update POST');
};