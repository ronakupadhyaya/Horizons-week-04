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
  User.find(function(errFindingUsers, foundUsers) {
    if (errFindingUsers) {res.send("Error finding users");}
    else {
      res.render('profiles', {users: foundUsers})
    }
  });
});

router.post('/follow/:userId', function(req, res) {
  req.user.follow(req.params.userId, function(err, success) {
    if (err) {res.send(err)}
    else {res.send(success);}
  });
});

router.get('/users/:userId', function(req, res, next) {

  // Gets all information about a single user
  User.findById(req.params.userId, function(errFindingUser, foundUser) {
    if (errFindingUser) {res.send("Error finding user");}
    else {
      console.log(foundUser);
      foundUser.getFollows().populate('follower').exec(function(errGettingFollows, gotFollows) {
        if (errGettingFollows) {res.send(errGettingFollows);}
        else {
          res.render('singleProfile', {user: foundUser, followers: gotFollows});
        }
      })
    }
  });

});

router.get('/tweets/', function(req, res, next) {

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
