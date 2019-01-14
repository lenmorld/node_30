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
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) return callback(err);
        callback(null, result);
          // if (result) {
          //   return callback(null, user);
          // } else {
          //   return callback();
          // }
      })
    });
}

// another way
UserSchema.methods.comparePassword = function(inputPassword, callback) {
  console.log("input: ", inputPassword);
  console.log("this: ", this.password);
  bcrypt.compare(inputPassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    console.log(err, isMatch);
    callback(null, isMatch);
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;