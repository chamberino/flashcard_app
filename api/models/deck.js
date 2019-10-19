// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
  title: {type: String, required: true, maxlength: 50},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  subject: [{type: Schema.Types.ObjectId, ref: 'Subject', required: true}]
});

// Virtual for Deck's URL
DeckSchema
.virtual('url')
.get(function () {
  return '/catalog/deck/' + this._id;
});

//Export function to create "User" model class
module.exports = mongoose.model('Deck', DeckSchema);