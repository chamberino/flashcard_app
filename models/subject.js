// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, required: false, auto: true},
  name: {type: String, required: true, maxlength: 50},
  isPrimarySubject: {type: Boolean, default: false, required: true}
});

// Virtual for Subject's URL
SubjectSchema
.virtual('url')
.get(function () {
  return '/subject/' + this._id;
});


//Export function to create "User" model class
module.exports = mongoose.model('Subject', SubjectSchema);