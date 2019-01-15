var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  // console.log(req);
  return res.send("working");
});

router.get('/json', function(req, res, next) {
  // console.log(req);
  return res.send(JSON.stringify({
    name: "Lenny"
  }));
});

// POST - register user
router.post('/register', function(req, res, next) {
  console.log(req.body);
  // confirm password
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match');
    err.status = 400;
    res.send("passwords don't match");
    return next(err);
  }

  if (req.body.email && 
      req.body.username && 
      req.body.password && 
      req.body.passwordConf) {

        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          passwordConf: req.body.passwordConf,
        }

        console.log("user data", userData);

        // schema.create to insert data into db
        User.create(userData, function(error, user) {
          if (error) {
            return next(error);
          } else {
            console.log(user);
            // === SET SESSION DETAILS ===
            // TODO: set _id from login, not register
            // req.session.userId = user._id;

            return res.send(user.username + " is registered ✅");
            // return res.redirect('/profile');
          }
        });
      }
});

// POST - login
router.post('/login', function(req, res, next) {
  var username = req.body.username;

  User.authenticate(username, req.body.password, function(error, isMatch, userId) {
    console.log("body:", req.body.password, isMatch);
    console.log(error);
    console.log(isMatch);
    if (isMatch, userId) {
      // === SET SESSION DETAILS ===
      // TODO: set usdeId from login
      req.session.userId = userId;
      return res.send(username + " is logged in successfully, with session.userId " + req.session.userId );
    }
    else {
      return res.send("login unsuccessful " + error);
    }
  })
});


// GET - logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        // req.session is deleted

        console.log("Successful logout");
        return res.send("LOGGED OUT");
        // return res.redirect('/');
      }
    });
  }
});

module.exports = router;