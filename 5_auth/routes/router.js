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
            // === SET SESSION DETAILS ===
            // req.session.userId = user.id;
            return res.redirect('/profile');
          }
        });
      }
});

// POST - login
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  // console.log(req.body);
  User.findOne({ username: username }, function(err, user) {
    console.log("Found: ", user);

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) {
        return next(err);
      }
      console.log(req.body.password, isMatch);
      return res.send(username + " is logged in successfully ");
    });
  })
});


module.exports = router;