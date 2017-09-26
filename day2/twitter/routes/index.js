var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users/', function(req, res, next) {

  // Gets all users

});

router.get('/users/:userId', function(req, res, next) {
  // Gets all information about a single user
  User.findById(req.params.userId, function(err, user) {
    if(err) {
      res.status(500).send('mlab failed to look up id');
    } else {
      if(!user) {
        res.status(400).send('No user exists with that id');
      } else {
        var viewer = req.user;
        // result has arrays result.followings, result.follows
        viewer.getFollows(function(err, result) {
          if(err) {
            res.status(500).send(err);
          } else {
            var isFollowing = false;
            console.log(result, user._id);
            result.followees.forEach(function(followerObject) {
              if(followerObject.followee.equals(user._id)) {
                isFollowing = true;
                console.log('match');
              }
            });
            if(isFollowing) {
              res.render('singleProfile', {
                user, //fuck es6
                isFollowing,
              });
            } else {
              res.render('singleProfile', {
                user,
              });
            }
          }
        });
      }
    }
  });
});

router.post('/follow/:userId', function(req, res) {
  req.user.follow(req.params.userId, function(err) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.redirect('/users/'+req.params.userId);
    }
  });
});

router.post('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function(err) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.redirect('/users/'+req.params.userId);
    }
  });
});

router.get('/tweets/', function(req, res, next) {
  res.render('tweets');
  // Displays all tweets in the DB

});

router.get('/tweets/:tweetId', function(req, res, next) {

  //Get all information about a single tweet

});

router.get('/tweets/:tweetId/likes', function(req, res, next) {

  //Should display all users who like the current tweet

});

router.post('/tweets/:tweetId/likes', function(req, res, next) {

  //Should add the current user to the selected tweets like list (a.k.a like the tweet)

});

router.get('/tweets/new', function(req, res, next) {

  //Display the form to fill out for a new tweet

});

router.post('/tweets/new', function(req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB


});

module.exports = router;
