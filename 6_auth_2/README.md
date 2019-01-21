BACKEND
send JWT along with every request to the API
no sessions

FRONTEND
no cookies
can save JWT in localStorage


`npm install passport passport-jwt jsonwebtoken`


Passport.js
- works with the concept of strategies,
which is a middleware function that a 
request runs through before getting to the actual route
- if strategy fails (callback called with an error that is not `null` or `false`), the route will not be called
but a __401 Unauthorized__ response sent


`ExtractJwt.fromAuthHeaderAsBearerToken()`
- can replace with other extraction methods, or even write your own
https://github.com/themikenicholson/passport-jwt



`http://www.passportjs.org/docs/authenticate/`

Note that it is possible to add <config> 

```
config = {
  session: false,   // whether to establish a session after successful redirect
  successRedirect: '/',  
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.',
  successFlash: 'Welcome!'
}

```

`session: false`  
true: whether to establish a session after successful redirect
false: require credentials to be supplied with each request
```
app.post('/login',
  passport.authenticate('local', config ),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });
```

### working !!! ###

User log-in, gets token

![](screens/2019-01-20-11-16-07.png)


Use token to authenticate access to /secret page

![](screens/2019-01-20-11-16-34.png)

### Implementing passport.authenticate

If we were to implement passport.authenticate, 
using only barebones `jwt` methods
it would look like this

1. obtain token from request headers 
2. `jwt.verify(token, config.secret, (err, decoded) => {} )`   // check validity of JWT with initially configured secret key
3. use `decoded` in callback or send error message

```
let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};
```

https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4

### 6_E Implementing bare-bones JWT sign() and verify()

```
app.post('/login', function(req,res) {
  // fetch user id using req.body
  var token = jwt.sign({ id: user_id })
  res.json({token: token, message: 'ok'})
})
```

```
app.get('/secret',
 function customAuth(req,res) {
  // get jwt from headers
  var token = req.headers['x-access-token'] || req.headers['authorization'];
  var token_string = token.split("Bearer ")[1];

  jwt.verify(token_string, 'secret', function(err, decoded) {
      if (err)  {
        res.status(401);
        return res.json({"message": "Token not valid");
      }

      req.decoded = decoded;  
      next();
  },
  
   function(req, res, next) {
      res.json("Access granted! " + req.decoded); 
   } 
  );
})
```

