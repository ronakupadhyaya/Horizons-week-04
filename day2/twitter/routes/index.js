var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users/', function (req, res, next) {

  // Gets all users

});

router.get('/users/:userId', function (req, res, next) {
  // Gets all information about a single user
  User.findById(req.params.userId, function (error, user) {
    res.render('singleProfile', user)
  })
});

router.get('/follow/:userId', function (req, res, next) {
  User.findById(req.params.userId, function (error, user) {
    if (error) {
      console.log(error)
    } else {
      req.user.follow(user._id, function (error, success) {
        if (error) {
          console.log('Couldn\'t follow..')
        } else {
          console.log('Followed successfully')
        }
      })
    }
  })
})

router.get('/unfollow/:userId', function (req, res, next) {
  User.findById(req.params.userId, function (error, user) {
    if (error) {
      console.log(error)
    } else {
      req.user.unfollow(user._id, function (error, success) {
        if (error) {
          console.log('Couldn\'t unfollow..')
        } else {
          console.log('Unfollowed successfully')
        }
      })
    }
  })
})

router.get('/tweets/', function (req, res, next) {

  // Displays all tweets in the DB

});

router.get('/tweets/:tweetId', function (req, res, next) {

  //Get all information about a single tweet

});

router.get('/tweets/:tweetId/likes', function (req, res, next) {

  //Should display all users who like the current tweet

});

router.post('/tweets/:tweetId/likes', function (req, res, next) {

  //Should add the current user to the selected tweets like list (a.k.a like the tweet)

});

router.get('/tweets/new', function (req, res, next) {

  //Display the form to fill out for a new tweet

});

router.post('/tweets/new', function (req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB


});

module.exports = router;
