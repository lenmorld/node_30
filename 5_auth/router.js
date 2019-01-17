var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var User = require('./models/user');

// GET /
router.get('/', function(req, res, next) {
  // console.log(req);
  // return res.send("working");
  // res.sendFile(__dirname + "/public/index.html");
  res.render("index");
});

router.get('/login_page', function(req, res, next) {
  // res.sendFile(__dirname + "/public/login.html");

  // TODO: track unsuccessful login attempts
  res.render("login", {login_attempts: req.session.login_attempts});
});

router.get('/register_page', function(req, res, next) {
  // res.sendFile(__dirname + "/public/register.html");
  res.render("register");
});


router.get('/secret_page', function(req, res, next) {
  // res.sendFile(__dirname + "/public/secret.html");

  if (req.session.userId) {
    // render secret_page and pass session data
    res.render('secret', {user_id: req.session.userId, views: req.session.views} );
  } else {
    // NOT LOGGED IN YET, redirect to /login
    res.redirect('/login_page');
  }

  // res.render("secret");
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
  // it only arrives here if successfully logged in
  res.render('secret', {user_id: req.session.userId, views: req.session.views} );
});

// ===============

router.get('/json', function(req, res, next) {
  // console.log(req);
  return res.send(JSON.stringify({
    name: "Lenny"
  }));
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
            console.log(user);
            // === SET SESSION DETAILS ===
            // set _id from login, not register
            // req.session.userId = user._id;

            // return res.send(user.username + " is registered ✅");
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
      // === SET SESSION DETAILS ===
      // set session userId after succssful login
      req.session.userId = userId;

      // count number of views
      req.session.views = (req.session.views || 0) + 1;

      // return res.send(username + " is logged in successfully, with session.userId " + req.session.userId );

      // better to redirect, then render the secret page from that redirect
      return res.redirect('/secret_page');
      // return res.render('secret', {user_id: req.session.userId, views: req.session.views} );
    }
    else {
      // track unsuccessful attempts
      req.session.login_attempts = (req.session.login_attempts || 0) + 1;

      return res.redirect('/login_page');
      // return res.send("login unsuccessful " + error);
    }
  })
});


// GET - logout
router.get('/logout', function(req, res, next) {
  if (req.session) {

    // TODO: try-catch here
    // destroy cookie-session
    req.session = null;

    console.log("Successful logout");
    // return res.send("LOGGED OUT");

    // return res.redirect('/');
    return res.render('index');

    // delete session object
    // req.session.destroy(function(err) {
    //   if (err) {
    //     return next(err);
    //   } else {
    //     // req.session is deleted
    //     console.log("Successful logout");
    //     // return res.send("LOGGED OUT");

    //     // return res.redirect('/');
    //     return res.render('index');
    //   }
    // });
  }
});

module.exports = router;