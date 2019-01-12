var express = require('express');
var router = express.Router();


// GET /
router.get('/', function(req, res, next) {
  console.log(req);
  return res.send("working");
});

router.get('/json', function(req, res, next) {
  console.log(req);
  return res.send(JSON.stringify({
    name: "Lenny"
  }));
});

// POST route for updating data
router.post('/', function(req, res, next) {
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


module.exports = router;