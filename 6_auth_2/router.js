var express = require('express');
var router = express.Router();

var User = require('./models/user');

router.get('/', function(req, res, next) {
  res.render("index");
});

router.get('/login_page', function(req, res, next) {
  res.render("login", {login_attempts: req.session.login_attempts});
});

router.get('/register_page', function(req, res, next) {
  res.render("register");
});

router.get('/secret_page', function(req, res, next) {
  if (req.session.userId) {
    res.render('secret', {user_id: req.session.userId, views: req.session.views} );
  } else {
    res.redirect('/login_page');
  }
});

// same with /secret_page, but using a middleware to require login
function requiresLogin(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    // return next(err);  // send a nasty error to frontend
    return res.redirect('/login_page');
  }
}

router.get('/secret_page_2', requiresLogin, function(req, res, next) {
  res.render('secret', {user_id: req.session.userId, views: req.session.views} );
});

// POST - register user
router.post('/register', function(req, res, next) {
  console.log("register" + req.body.email);
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
            return res.redirect('/login_page');
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
      req.session.userId = userId;
      req.session.views = (req.session.views || 0) + 1;
      return res.redirect('/secret_page');
    }
    else {
      req.session.login_attempts = (req.session.login_attempts || 0) + 1;
      return res.redirect('/login_page');
    }
  })
});

// GET - logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session = null;
    console.log("Successful logout");
    return res.render('index');
  }
});

module.exports = router;