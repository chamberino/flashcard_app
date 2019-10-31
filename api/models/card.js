// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const CardSchema = new Schema(
  {
    deck: {type: Schema.Types.ObjectId, ref: 'Deck', required: true},
    question: {type: String, required: true},
    answer: {type: String, required: true},
    hint: {type: String, required: false},
  }
);

// Virtual for card's URL
CardSchema
.virtual('url')
.get(function () {
  return '/card/' + this._id;
});

//Export function to create "Card" model class
module.exports = mongoose.model('Card', CardSchema);