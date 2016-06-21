// imports n' things
var router = require('express').Router();
var models = require('../models/models');
var express = require('express');
module.exports = function(passport) {
  // YOUR CODE HERE
  
  //FOR GET
  router.get('/register', function(req, res, next) {
  	res.render('register');
  })
  
  //FOR POST
  var validateRegistration = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/register', function(req, res) {
    // validation step
    if (!validateRegistration(req.body)) {
      res.render('register', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });

    console.log('user is ' + u);
    
    u.save(function(err, user) {
      console.log('HI IM TRYING TO SAVE');
      if (err) {
        console.log(err);
        console.log('halp');
        res.status(500).redirect('/register');
        return;
      } else {
      	console.log('saved user is ' + user);
      	res.redirect('/login');
      }
    });
  });

  //GET REGISTERED USERS!!!!!!!!!! USING SOME DOPE ASS SHIT

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local'), function(req, res) {
  	res.redirect('/');
  });

  router.get('/logout', function(req, res) {
  	req.logout();
  	res.redirect('/login');
  })

  return router;
};
