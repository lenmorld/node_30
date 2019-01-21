var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('./models/user');

router.get('/', function(req, res, next) {
  // res.json({message: "Express is up!"});
  res.render("index");
});

router.get('/login', function(req, res, next) {
  // res.render("login", {login_attempts: req.session.login_attempts});
  res.render("login_page", {login_attempts: 0});
});

router.get('/register', function(req, res, next) {
  res.render("register_page");
});

// same with /secret_page, but using a middleware to require login
// function requiresLogin(req, res, next) {
//   if (req.session.userId) {
//     return next();
//   } else {
//     var err = new Error('You must be logged in to view this page.');
//     err.status = 401;
//     // return next(err);  // send a nasty error to frontend
//     return res.redirect('/login');
//   }
// }

// router.get('/secret2', requiresLogin, function(req, res, next) {
//   res.render('secret_page', {user_id: req.session.userId, views: req.session.views} );
// });

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
router.post("/login", function(req, res) {
  var username, password;
  if(req.body.username && req.body.password){
    username = req.body.username;
    password = req.body.password;
  }
  // usually this would be a database call:
  // var user = users[_.findIndex(users, {name: name})];
  // var user = users[0];
  var user = users.filter(function(u) {
    return u.username === username; 
  })[0];
  if( !user ){
    res.status(401).json({message:"no such user found"});
  }

  if (user.password === password) {
    // identify user by id, which we'll put in the token
    var payload = { id: user.id };
    // var token = jwt.sign(payload, jwtOptions.secretOrKey);
    var token = jwt.sign(payload, 'secret');

    res.json({
      message: "ok",
      token: token,
    });
  } else {
    res.status(401).json({
      message: "password does not match the one saved un db"
    })
  }
});

// router.post('/login', function(req, res, next) {
//   var username = req.body.username;

//   User.authenticate(username, req.body.password, function(error, isMatch, userId) {
//     console.log("body:", req.body.password, isMatch);
//     console.log(error);
//     console.log(isMatch);
//     if (isMatch, userId) {
//       req.session.userId = userId;
//       req.session.views = (req.session.views || 0) + 1;
//       return res.redirect('/secret_page');
//     }
//     else {
//       req.session.login_attempts = (req.session.login_attempts || 0) + 1;
//       return res.redirect('/login_page');
//     }
//   })
// });

// Passport.js middleware
router.get('/secret', 
// passport.authenticate('jwt', { session: false }), 
function customAuth(req, res, next) {
  // console.log(req.headers);
  var token = req.headers['x-access-token'] || req.headers['authorization'];
  console.log(token);
  var token_string = token.split("Bearer ")[1];
  jwt.verify(token_string, 'secret', function(err, decoded) {
    if (err) {
      res.status(401);
      return res.json({
        message: "Token is not valid"
      })
    } else {
      console.log("Decoded: ", decoded);
      req.decoded = decoded;  
      next();
    }
  });
},
  function(req, res, next) {
    res.json("Success! Check token " + JSON.stringify(req.decoded));
    // if (req.session.userId) {
    //   res.render('secret_page', {user_id: req.session.userId, views: req.session.views} );
    // } else {
    //   res.redirect('/login');
    // }
});

router.get("/secretDebug",
  function(req, res, next){
    console.log(req.get('Authorization'));
    next();
  }, function(req, res){
    res.json("debugging");
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