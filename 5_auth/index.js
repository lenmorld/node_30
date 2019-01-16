var express = require('express');
var app = express();
var body_parser = require('body-parser');
// var session = require('express-session');
var cookieSession = require('cookie-session')

// set the view engine to ejs
app.set('view engine', 'ejs');

// 'views' folder served by default, when using render()

// serve static files from /public
// app.use(express.static(__dirname + '/public'));


// Mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_test');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb!");
  // we're connected!
});

// == end of mongoose ==

// == SESSIONS config  to track logins ==
// > express-session
// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false
// }));

// > cookie-session
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'session', 
  secret: 'secret_key',         // use 1 secret or keys array
  // keys: ['key1', 'key2'],    // always use keys[0] for signing cookies, others are used for verification
  httpOnly: true,   // false allows access using `document.cookie` but is not secure
}));


// parse form data - application/x-www-form-urlencoded
app.use(body_parser.urlencoded( { extended: false } ));
// parse application/json
app.use(body_parser.json());


// include routes
var routes = require('./router');
app.use('/', routes);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// // define as the last app.use callback
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json('error', {
//     message: err.message,
//     error: {}
//   });
// });

// listen on port 3000
app.listen(3003, function () {
  console.log('Express app listening on port 3003');
});