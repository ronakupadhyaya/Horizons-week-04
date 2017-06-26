var express = require('express');
var router = express.Router();


module.exports = function(passport) {
  router.use(function(req, res, next){
    if (!req.user) {
      res.redirect('/login');
    } else {
      return next();
    }
  });

  router.get('/', function(req, res, next) {
      res.redirect('/contacts');
  });
  router.get('/signup', function(req, res, next) {
      res.render('signup');
  });


  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  // router.post('/signup', function(req, res) {
  // // validation step
  //   if (!validateReq(req.body)) {
  //     return res.render('signup', {
  //       error: "Passwords don't match."
  //     });
  //   }
  //   var u = new models.User({
  //     username: req.body.username,
  //     password: req.body.password,
  //     address: req.body.address,
  //     displayName: req.body.displayName
  //   });
  //   console.log("asd")
  //   console.log(u)
  //   u.save(function(err, user) {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).redirect('/register');
  //       return;
  //     }
  //     console.log(user);
  //     res.redirect('/login');
  //   });
  // });

  return router;
}
