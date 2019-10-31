const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String, required: true, maxlength: 50, trim: true},
  last_name: {type: String, required: true, maxlength: 50, trim: true},
  email: {type: String, required: true, maxlength: 50, trim: true},
  password: {type: String, unique: true, required: true, minlength: 4}
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
    return '/user/' + this._id;
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email })
        .exec( function(error, user) {
            if (error) {
                return callback(error)
            } else if ( !user ) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error, result) {
                if (result === true) {
                    return callback(null, user)
                } else {
                    return callback(error);
                }
            })
        })
}

// hash password before saving to database 
UserSchema
.pre('save', function(next) {    
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        // change password to hashed password
        user.password = hash;
        next();
    })
});

//Export function to create "User" model class
const User = mongoose.model('User', UserSchema);
module.exports = User;