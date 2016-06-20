// imports n' things
var router = require('express').Router();
var User = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE

  router.get('/register', function(req, res, next){
    res.render('register');
  });

  router.post('/register', function(req, res, next){
        var user = new User({
          username: req.body.username,
          password: req.body.password
        });
        if(req.body.password === req.body.password2){
          user.save(function(errors){
            if(errors){
              console.log("Could Not Save: ", errors);
            }else{
              res.redirect('/login');
            }
          });
        }
  });

  router.get('/login', function(req, res, next){
    res.render('login');
  });

  router.post('/login', passport.authenticate('local'), function(req, res){
    // var errors = req.validationErrors();
    // if(erros){
    //   res.redirect('/login');
    // }else{
      res.redirect('/');
    //}
  });

  router.get('/logout', function(req, res, next){
    res.render('logout');
  });

  router.post('/logout', function(req, res, next){
    req.logout();
    res.redirect('/login');
  });

  return router;
};
