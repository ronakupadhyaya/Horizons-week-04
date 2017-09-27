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
  User.findById(req.params.userId, function(err, person){
    if(err){
      res.send(err)
    } else {
      console.log(person);
      res.render('singleProfile', {user: person})
    }
  })
});

router.post('/followMe/:userid', function(req, res, next) {
  User.findById(req.params.userid, function(error, user){
    if(error){
      res.send(error);
    } else {
      Follow.findOne({followers: req.user, following: req.params.userid}, function(error, result){
        if(result){
          res.send('You already followed')
        } else {
          user.follow(req.params.userid, function(err, results){
            res.send("you have followed")
          })
        }
      })
    }
  })
})

router.post('/unFollow/:userid', function(req, res, next) {
  console.log("sanity check");
  User.findById(req.params.userid, function(error, person){
    if(error){
      res.send(error);
    } else {
      Follow.findOne({followers: req.user, following: req.params.userid}, function(error, result){
        if(result){
          person.unfollow(req.params.userid, function(err, results){
            res.send("you have unfollowed")
          })
        } else{
          res.send("Matt's a dick");
        }


      })
    }
  })
})

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
