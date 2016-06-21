// imports n' things
var router = require('express').Router();
var models = require('../models/models');

module.exports = function(passport) {
  router.get('/register', function(req,res,next){
    res.render('register');
  });

  function validate(req) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordRepeat', "Password don't match").notEmpty().equals(req.body.password);
  };

  router.post('/register', function(req,res,next){
    validate(req);
    var errors = req.validationErrors();
      if (errors) {
        res.render('register', {errors: errors});
      } else {
        var u = new models.user({
            username: req.body.username,
            password: req.body.password
        });
          u.save(function(error,user){
            if(error){
              res.status(400).send('error creating user'+ error);
            }else{
              res.redirect('/login');
            }
          });
      }}
    );

    router.get('/login', function(req,res,next){
      res.render('login');
    });

    router.post('/login', passport.authenticate('local'), function(req, res){
      res.redirect('/');
    });

    router.get('/logout', function(req,res,next){
      req.logout();
      res.redirect('/login');
    });

    return router;
};
