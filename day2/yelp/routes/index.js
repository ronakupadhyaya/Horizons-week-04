var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

//GEOCODING
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyC7PnlgvcUFoVuQfJTXPj6K2rQi2LZbGZk",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    console.log(users);
    res.render('profiles', {
      users: users
    });
  });
})

router.get('/users/:userId', function(req, res, next) { //req.user is the current user object
  User.findById(req.params.userId, function (err, currUser) {
    if (currUser) {
      console.log('curr', currUser);
      User.findById(req.user._id, function(err, sessionUser) { //sessionUser is the one currently logged in
        if (sessionUser) {
          sessionUser.getFollows(currUser._id, function(followers, following) {
            sessionUser.isFollowing(currUser, function(success) {
              console.log(following);
              console.log('followed', followers)
              res.render('singleProfile', {
                user: currUser,
                followers: followers,
                following: following,
                alreadyFollowed: success
              });
            });
          });
        }
        else {
          console.log('could not find session user');
        }
      });
    }
    else {
      res.status(400).send('Invalid user id');
    }
  });
  // User.findById(req.params.userId, function(err, user) {
  //   req.user.getFollows(req.params.userId, function(followers, followings) {
  //     console.log('followers', followers);
  //     console.log('followings', followings); //check all people you aren't following and if you aren't following them then you want the button
  //     res.render('singleProfile', {
  //       user: user,
  //       followers: followers,
  //       following: followings
  //       //following_true: following_true
  //     });
  //   });
  // });
  //finding the user of the page you are on, and then finding the user of the session, and then getting follows of session and then
  //checking if isfollowing
});

router.post('/follow/:userId', function(req, res, next) {
  req.user.follow(req.params.userId, function() {
    res.redirect('/users/' + req.params.userId);
  });
});

router.post('/unfollow/:userId', function(req, res, next) {
  req.user.unfollow(req.params.userId, function() {
    res.redirect('/users/' + req.params.userId);
  });
});

router.get('/single/:restaurantId', function(req, res, next) {
  Restaurant.findById(req.params.restaurantId, function(err, rest) {
    if (rest) {
      res.render('singleRestaurant', {
        restaurant: rest
      });
    }
    else {
      res.status(400).send('Invalid user id');
    }
  });
});

router.get('/all/restaurants', function(req, res, next) {
  Restaurant.find(function(err, rests) {
    console.log('rests', rests);
    if (err) {
      console.log('error');
    }
    else {
      res.render('restaurants', {
        restaurants: rests
      });
    }
  });
});

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  //GEOCODING
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log('data', data);
  });
  var newR = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.open,
    closingTime: req.body.closing
  });
  newR.save(function(err, rest) {
    if (err) {
      console.log('error');
    }
    else {
      res.redirect('/all/restaurants');
    }
  })
});

module.exports = router;
