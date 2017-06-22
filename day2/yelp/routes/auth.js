// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');
var Restaurant = models.Restaurant;


module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  //GET restaurant registration page

  router.get('/create', function(req, res) {
    res.render('newRestaurant');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      email: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
      location: req.body.location
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

  router.post('/create', function(req, res) {

    var u = new models.Restaurant({
      name: req.body.restaurantName,
      address: req.body.address,
      //    longitude: req.body.longitude,
      price: req.body.restaurantPrice,
      openTime: req.body.openingTime,
      closingTime: req.body.closingTime,

    });

    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/create');
        return;
      }
      console.log(user);
      res.redirect('/restaurants');
    });
  });

  router.get('/restaurants', function(req, res) {
    // res.render('restaurants')
    Restaurant.find(function(err, restaurant) {
      if (err || !restaurant) {
        res.status(404).send("No restaurant");
      } else {
        res.render('restaurants', {
          restaurant: restaurant
        });
      }
    })

  })

  router.get('/restaurants/:restaurantId', function(req, res) {
    var restaurantId = req.params.restaurantId;

    Restaurant.findById(restaurantId, function(err, restaurant) {
      if (err || !restaurant) {
        res.status(404).send("No restaurant");
      } else {
        res.render('singleRestaurant', {
          restaurant: restaurant
        });
      }
    })


  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
