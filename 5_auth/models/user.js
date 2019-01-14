var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

// pre-save hook to the schema
// hash password
UserSchema.pre('save', function(next) {
  var user = this;
  // hash(plaintext, saltRounds, function)
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


// static authenticate method
// UserSchema.statics.authenticate = function(email, password, callback) {
UserSchema.statics.authenticate = function(username, password, callback) {
  // console.log(req.body);
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      callback(err)
    } else if (!user) {
      var err = new Error('User not found');
      err.status = 401;
      callback(err);
    }
    console.log("Found: ", user);
    console.log("input: ", password);
    console.log("this: ", user.password);
    bcrypt.compare(password, user.password, function(err2, isMatch) {
      if (isMatch) {
        callback(null, isMatch);
      } else {
        var err = new Error('User not found');
        err.status = 401;
        callback(err);
      }
    });
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;