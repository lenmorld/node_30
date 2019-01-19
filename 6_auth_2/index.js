var express = require('express');
var app = express();
var body_parser = require('body-parser');
var cookieSession = require('cookie-session');    // or use express-session

app.set('view engine', 'ejs');

// Mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb!");
});

// cookie-session config
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session', 
  secret: 'secret_key',
  httpOnly: true,
}));

app.use(body_parser.urlencoded( { extended: false } )); // parse application/x-www-form-urlencoded
app.use(body_parser.json()); // parse application/json

var routes = require('./router');
app.use('/', routes);

app.listen(3004, function () {
  console.log('Express app listening on port 3003');
});