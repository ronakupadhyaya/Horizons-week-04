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
  User.findById(req.params.userId,function(err, user){
    if(err){
      console.error(err);
    }
    else{
      var notOwnAccount = (req.user.id !== user.id);
      var buttonData = JSON.stringify({idToFollow: user._id,followerId: req.user._id});
      if(notOwnAccount){
        var isAlreadyFollowing = false;
        Follow.findOne({following: user._id, follower: req.user._id},function(err, foundFollow){
          if(err){
            console.log('Error while looking for follow object.');
          }
          else if(foundFollow){
            isAlreadyFollowing = true;
          }
          res.render('singleProfile',{user:user, notOwnAccount: true, isAlreadyFollowing: isAlreadyFollowing, buttonData:buttonData});
        });
      }
      else{
        res.render('singleProfile',{user:user, notOwnAccount: false, buttonData:buttonData});
      }
    }
  });
});

router.post('/follow',function(req,res){
  User.findById(req.body.followerId,function(err,user){
    if(err){
      console.log('User not found');
      res.status(400).send("Can't find user account");
    }
    else{
      user.follow(req.body.idToFollow,function(err){
        if(err){
          console.log('Follow Failed');
          res.status(400).send(err);
        }
        else{
          res.send("Success");
        }
      });
    }
  });
});

router.post('/unfollow',function(req,res){
  User.findById(req.body.followerId,function(err,user){
    if(err){
      console.log('User not found');
      res.status(400).send("Can't find user account");
    }
    else{
      user.unfollow(req.body.idToFollow,function(err){
        if(err){
          console.log('Unfollow Failed');
          res.status(400).send(err);
        }
        else{
          res.send("Success");
        }
      });
    }
  });
});

router.get('/allFollowers/:userId',function(req,res){
  User.findById(req.params.userId,function(err,user){
    if(err){
      res.status(400).send(err);
    }
    else if(!user){
      res.status(400).send('No user found for given user ID.');
    }
    else{
      user.getFollows(function(err2,following,followers){
        if(err2){
          res.status(500).send('Problem getting followers');
        }
        else{
          res.json(followers);
        }
      });
    }
  });
});

router.get('/allFollowing/:userId',function(req,res){
  User.findById(req.params.userId,function(err,user){
    if(err){
      res.status(400).send(err);
    }
    else if(!user){
      res.status(400).send('No user found for given user ID.');
    }
    else{
      user.getFollows(function(err2,following,followers){
        if(err2){
          res.status(500).send('Problem getting followers');
        }
        else{
          res.json(following);
        }
      });
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
