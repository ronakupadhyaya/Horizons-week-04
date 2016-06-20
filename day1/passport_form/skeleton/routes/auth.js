// imports n' things
var router = require('express').Router();
var User = require('../models/models');

module.exports = function(passport) {
  // YOUR CODE HERE
  router.get('/register',function(req,res,next) {
    if (req.query.pwdiff){
      console.log('entered');
      res.render('register',{error:"Passwords don't match"});
    } else if (req.query.ept) {
      res.render('register',{error:"empty password"});
    } else {
      res.render('register');
    }

  });

  router.post('/register',function(req,res,next) {
    var pw = req.body.password;
    var un = req.body.username;
    var pw_2 = req.body.password_2;
    if (pw && pw_2) {
      if (pw === pw_2) {
        var user = new User({
          username: un,
          password: pw
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('user saved:',un);
            res.redirect('/login');
          }
        });
      } else {
        res.redirect('/register?pwdiff=yes');
      }
    } else {
      res.redirect('/register?ept=yes');
    }
  });

  router.get('/',function(req,res,next) {
    res.render('index');
  });
  router.get('/login',function(req,res,next) {
    if (req.query.mismatch) {
      res.render('login',{error:"Invalid username/password combination"});
    } else {
      res.render('login');
    }
  });
  router.post('/login',passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });
  router.get('/logout',function(req,res,next) {
    req.logout();
    res.redirect('/login');
  })


  return router;
};
