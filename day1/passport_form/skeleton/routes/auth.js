// imports n' things
var router = require('express').Router();
var User = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  
  router.get('/register', function(req,res){
  	res.render('register');
  });
  router.post('/register',function(req,res){
	 if (!req.isAuthenticated()) {
    res.redirect('/login');
    return;
  }
    var u = new User({
      username: req.body.username,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });
  router.get('/login',function(req, res){
  	res.render('login');
  });
 router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });
 router.post('/', function(req, res){
  res.redirect('/logout');
 });

 router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
 });
  return router;
};
