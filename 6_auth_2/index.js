var express = require('express');
var app = express();
var body_parser = require('body-parser');
var cookieSession = require('cookie-session');    // or use express-session

// === Passport, JWT ===
jwt = require('jsonwebtoken');
passport = require('passport');
passportJWT = require('passport-jwt');

ExtractJwt = passportJWT.ExtractJwt;
JwtStrategy = passportJWT.Strategy;

// TODO remove global vars
app.set('view engine', 'ejs');

users = [
  {
    id: 1,
    username: 'lenny',
    password: '1234'
  },
  {
    id: 2,
    username: 'tammy',
    password: '1234'
  }
];

jwtOptions = {
  // jwtFromRequest: ExtractJwt.fromAuthHeader(),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',    // NOTE: use a private key if possible
};

function jwtStrategyCallback(jwt_payload, next) {
  console.log('payload received', jwt_payload);

  // TODO: database call to find user
  // var user = users[0];
  var user = users.filter(function(u) {
    return u.id === jwt_payload.id; 
  })[0];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

strategy = new JwtStrategy(jwtOptions, jwtStrategyCallback);
passport.use(strategy);

app.use(passport.initialize());

// Mongoose setup
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/auth_test');
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("connected to mongodb!");
// });

// cookie-session config
// app.set('trust proxy', 1);
// app.use(cookieSession({
//   name: 'session', 
//   secret: 'secret_key',
//   httpOnly: true,
// }));

app.use(body_parser.urlencoded( { extended: true } )); // parse application/x-www-form-urlencoded
app.use(body_parser.json()); // parse application/json

var routes = require('./router');
app.use('/', routes);

app.listen(3004, function () {
  console.log('Express app listening on port 3004');
});