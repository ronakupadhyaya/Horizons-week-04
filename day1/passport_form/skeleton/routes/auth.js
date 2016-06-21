// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Registration' });
  });
  router.post('/register', function(req, res, next){
    console.log(req.body);
    if(req.body.password !== req.body.confirm_password){
      res.render('register', {
          error: "Paswords dont match"
      }).end() }
      var U = new models.User({
      user: req.body.username,
      password: req.body.password
    });
    U.save(function(error, user){
      if(error){
          res.status(400).send("Error creating user: " + error)
      } else {
        res.redirect('/login');
        }
    })
  })

  router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
  });

  router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
    });

router.get('/logout', function(req, res, next) {
  req.logout();
  res.render('login', { title: 'Login' });
});
// router.post('/logout', function(req, res, next) {
//   req.logout();
//   res.render('login', { title: 'Login' });
// });
    return router;

  };
