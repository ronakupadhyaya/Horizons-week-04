var express = require('express');
var router = express.Router();
// var expressValidator = require('express-validator');
// router.use(expressValidator());
var User = require('../models/models.js').User;


module.exports = function(passport) {
    // Add Passport-related auth routes here, to the router!


      // call passport functions here but HOW??? aka how to utilize passport
      // does create user require phone?

    router.get('/', function(req, res, next){

    });

    router.get('/signup', function(req, res, next) {
      res.render('signup');
    });

    router.post('/signup', function(req, res, next) {
      // validate to prevent duplicate users
      var newName = req.body.name;
      var newPhone = req.body.phone;
      var newPassword = req.body.password;
      var confirmPassword = req.body.confirmpassword;
      if(newName && newPhone && newPassword && confirmPassword === newPassword) {
        var user = new User ({
          username: newName,
          password: newPassword,
          phone: newPhone
        });
        user.save(function(err){
          console.log(user);
          if(err) {
            res.status(500).json(err);
          } else { // else for saving user
            res.redirect('/login');
          }
        });
      } else { // else for invalid credentials
        console.log('invalid credentials');
        res.redirect('/signup');
      }
    })

    router.get('/login', function(req, res, next) {
      res.render('login');
    });

    // router.post('/login', function(req, res, next) {
    //   // how are we taking in credentials? passport isn't taking in anything
    //   passport.authenticate("local", {
    //     successRedirect: '/contacts',
    //     failureRedirect: '/login'
    //   });
    // })
    router.post('/login', passport.authenticate("local", {
      successRedirect: '/contacts',
      failureRedirect: '/login'
    }));


    return router;
}
