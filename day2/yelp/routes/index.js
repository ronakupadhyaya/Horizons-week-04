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
  apiKey: "AIzaSyCrbZtPEhP8OzmZDaLyYw4ldzlkpAox-bU",
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

//main page redirect
router.get('/', function(req, res) {
  res.render('home', {user: req.user});
});

//see all profiles
router.get('/profiles', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.status(404).send("Error loading profiles.");
    } else {
      res.render('profiles', {users: users});
    }
  });
});

//render single profile: get user, reviews, and follows to send to page
router.get('/profiles/:userId', function(req, res) {
  var userId = req.params.userId;
  var me = req.user;
  User.findOne({_id: userId}, function(err, user) {
    if (err || !user) {
      res.status(404).send("No user");
    } else {
      var name = user.displayName;
      me.isFollowing(user, function (thisIsFollowingUser) {
        var showFollowButton = (me.id !== user.id && thisIsFollowingUser === -1) ? true : false;
        var showUnfollowButton = (me.id !== user.id && thisIsFollowingUser === 1) ? true : false;
        // console.log("ME IS FOLLOWING USER: "+thisIsFollowingUser);
        // console.log("SHOW FOLLOW: "+showFollowButton+" SHOW UNFOLLOW: "+showUnfollowButton);

        user.getReviews(function(err, reviews) {
          if (err) {
            res.send("error getting reviews from user");
          } else {
            user.getFollows(function(err, followsObj) {
              if (err) {
                res.send("error getting follows of user: "+err);
              } else {
                res.render("singleProfile", {
                  user: user,
                  reviews: reviews,
                  followers: followsObj.allFollowers,
                  following: followsObj.allFollowing,
                  showFollowButton: showFollowButton,
                  showUnfollowButton: showUnfollowButton
                });
              }
            }) //close get follows for user
          }
        }); //close get reviews for user
      }); //close is following
    }
  }); //close find user
}); //close get single profile

//unfollow a user
router.post('/unfollow/:userId', function(req, res) {
  var me = req.user;
  User.findOne({_id: req.params.userId}, function(err, user) {
    if (err) {
      res.status(404).send("Error finding user to unfollow.");
    } else if (!user) {
      res.status(404).send("No user to unfollow.");
    } else {
      me.unfollow(user.id, function(err) {
        if (err) {
          res.status(404).send("Error unfollowing user.")
        } else {
          res.redirect("/profiles/");
        }
      }); //close unfollow
    }
  }); //close find user
}); //close post method

//follow a user
router.post('/follow/:userId', function(req, res) {
  var me = req.user;
  User.findOne({_id: req.params.userId}, function(err, user) {
    if (err) {
      res.status(404).send("Error finding user to unfollow.");
    } else if (!user) {
      res.status(404).send("No user to unfollow.");
    } else {
      me.follow(user.id, function(err) {
        if (err) {
          res.status(404).send("Error following user.");
        } else {
          res.redirect("/profiles/");
        }
      }); // close unfollow
    }
  }); //close find user
}); //close follow post

//see all restaurants
router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants) {
    if (err) {
      res.status(404).send("Error loading restaurants.");
    } else {
      console.log(restaurants);
      res.render('restaurants', {restaurants: restaurants});
    }
  })
});

//render form for new restaurant
router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});

//create new restaurant
router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  var address = req.body.address_number+" "+req.body.address_street+", "+req.body.address_city+", "+req.body.address_state;
  geocoder.geocode(address, function(err, data) {
    if (err) {
      res.status(404).send("Error geocoding address: "+err);
    } else {
      console.log(data);
      var long = data[0].longitude;
      var lat = data[0].latitude;

      var rest = new Restaurant ({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        latitude: lat,
        longitude: long,
        address: address,
        openTime: req.body.openTime,
        closingTime: req.body.closingTime,
        totalScore: 0,
        reviewCount: 0
      });
      rest.save(function(err, result) {
        if (err) {
          res.status(404).send("Error saving restaurant.");
        } else {
          res.redirect('/restaurants/'+rest.id);
        }
      }); //close save
    } //close else
  }); //close geocode
}); //close post


//show page of single restaurant
router.get('/restaurants/:restaurantId', function(req, res, next) {
  var restId = req.params.restaurantId;
  Restaurant.findOne({_id: restId}, function(err, restaurant) {
    if (err) {
      res.status(404).send("No restaurant.");
    } else {
      restaurant.getReviews(restId, function(err, reviews) {
        if (err) {
          res.status(404).send("No restaurant.");
        } else {
          res.render('singleRestaurant', {restaurant: restaurant, reviews: reviews});
        }
      }); //close get reviews
    }
  }); //close find restaurant
}); //close get method

//show form for review for a restaurant
router.get('/restaurants/:restaurantId/review', function(req, res, next) {
  Restaurant.findOne({_id:req.params.restaurantId}, function(err, restaurant) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.render('newReview', {restaurant: restaurant});
    }
  });
});

//create review for a restaurant
router.post('/restaurants/:restaurantId/review', function(req, res, next) {
  Restaurant.findOne({_id: req.params.restaurantId}, function(err, restaurant) {
    if (err || !restaurant) {
      res.status(404).send(err);
    } else {
      var rev = new Review({
        stars: req.body.stars,
        content: req.body.content,
        restaurant: req.params.restaurantId,
        user: req.user.id
      });
      rev.save(function(err) {
        if (err) {
          res.status(404).send(err);
        } else {
          restaurant.reviewCount += 1;
          restaurant.save(function(err) {
            if (err) {
              res.status(404).send(err);
            } else {
              res.redirect('/restaurants/'+req.params.restaurantId);
            }
          }); //close save restaurant
        }
      }); //close save review
    }
  }); //close find restaurant
}); //close post method

module.exports = router;
