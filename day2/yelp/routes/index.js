var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCuCULcri4WIvhs4xaQZuUaR20gWGS9Ro8",
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

router.get('/', function(req, res) {
  res.redirect('./profiles')
})

router.get('/profiles', function(req, res) {
  User.find(function(error, users) {
    res.render('profiles', {
      users: users,
      name: req.user.displayName,
      id: req.user._id
    })
  })
})

router.post('/profiles/:name', function(req, res) {
  User.findById(req.params.name, function(err, follow) {
    if (err) {
      res.send(err)
    } else if (!follow) {
      res.send("User doesn't exist")
    } else {
      var id = follow._id;
      req.user.follow(id);
      res.render('singleProfile', {
        user: follow
      })
    }
  })
})

router.get('/profiles/:name', function(req, res) {
  User.findById(req.params.name, function(error, follow) {
    follow.getFollowers(function(err, result) {
      follow.getFollowings(function(err, result2) {
        res.render('singleProfile', {
          user: follow,
          followers: result,
          followings: result2,
          name: req.user.displayName
        })
      })
    })
  })
})

router.get('/profiles/yours/:name', function(req, res) {
  User.findById(req.params.name, function(error, follow) {
    follow.getFollowers(function(err, result) {
      follow.getFollowings(function(err, result2) {
        res.render('yourpage', {
          user: follow,
          followers: result,
          followings: result2,
          name: req.user.displayName
        })
      })
    })
  })
})

router.post('/profiles/follow/:name', function(req, res) {
  User.findById(req.params.name, function(err, follow) {
    if (err) {
      res.send(err)
    } else if (!follow) {
      res.send("User doesn't exist")
    } else {
      var id = follow._id;
      req.user.follow(id);
      User.find(function(error, users) {
        res.render('profiles', {
          users: users
        })
      })
    }
  })
})

router.get('/unfollow/:name', function(req, res) {
  User.findById(req.params.name, function(err, follow) {
    if (err) {
      res.send(err)
    } else if (!follow) {
      res.send("User does not exist.")
    } else {
      var id = follow._id;
      req.user.unfollow(id);
      res.redirect('/profiles/yours/'+req.user._id)
    }
  })
})

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant')
});

router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log("DATA: "+ data);
    if (err) {
      res.send(err)
    } else {
      new Restaurant({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        openTime: req.body.opening,
        closingTime: req.body.closing,
        apiKey: geocoder.apiKey
      }).save(function(err, restaurant) {
        if (err) {
          res.send(err)
        } else {
          res.redirect('/restaurants')
        }
      })
    }
  });
});

router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, list) {
    if (err) {
      res.send(err)
    } else {
      res.render('restaurants', {
        restaurants: list
      })
    }
  })
});

router.get('/restaurants/:name', function(req, res, next) {
  Restaurant.findById(req.params.name, function(err, rest) {
    if (err) {
      res.send(err)
    } else {
      res.render('singleRestaurant', {
        restaurant: rest
      })
    }
  })
});

module.exports = router;
