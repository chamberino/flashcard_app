// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String, required: true, maxlength: 50},
  last_name: {type: String, required: true, maxlength: 50},
  email: {type: String, required: true, maxlength: 50},
  password: {type: String, required: true, minlength: 4}
});

// Virtual for user's full name
UserSchema
.virtual('name')
.get(function() {
    return this.first_name + ' ' + this.last_name;
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function() {
    return '/catalog/user/' + this._id;
});

//Export function to create "User" model class
module.exports = mongoose.model('User', UserSchema);