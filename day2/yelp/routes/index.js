var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;
var User = models.User;

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users', function(req, res){
  //obtain all the profiles
  User.find(function(err, users){
    if(err){
      res.send('An error occured')
    }else{
      res.render('profiles', {
        profiles: users
      })
    }
  })
})

router.get('/users/:userId', function(req, res){
  var userId = req.params.userId;
  var sessionUser = req.user.id;
  var cyrus;
  User.findById(sessionUser, function(err, user){
    //we determine if they are following
    user.isFollowing(userId, function(err,a){
      console.log(a)
      cyrus = a;
      User.findById(userId, function(error, user){
        if(error){
          res.send("There was an error finding the user");
        }else{
          var followers, following;
          user.getFollows(function(err, l, f){
            if(err){
              console.log('some error occured: ', err)
            }else{
              followers = f;
              following = l;
            }
          })
          console.log('cyrus: ',cyrus)
          res.render('singleProfile', {
            user: user,
            following: following,
            followers: followers,
            isFollowing: cyrus
          })
        }
      })
    })
  })


})

router.post('/users/:userId', function(req, res){

var thisUser = req.user.id; //gets the current user
  var userId = req.params.userId; //gets the user we are visiting
  User.findById(thisUser, function(error, user){
    if(error){
      console.log('an error occured: ', error);
    }else{
      //determine if they are already following
      user.isFollowing(userId, function(err, isFollowing){
          if(isFollowing){
            user.unfollow(userId, function(err, success){
              console.log('unfollowed')
              if(err){
              }else{
                res.redirect('/users/' + userId)
              }
            })
          }else{
            user.follow(userId, function(err, success){
              if(err){
              }else{
                res.redirect('/users/' + userId)
              }
            })
          }

      })
    }
  })
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});




module.exports = router;
