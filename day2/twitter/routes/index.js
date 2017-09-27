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
  User.find(function(err, users) {
    if(err) {
      res.status(500).send('mlab failed to find users');
    } else {
      res.render('profiles', {
        viewer: req.user,
        profiles: users,
      });
    }
  })
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
            result.followees.forEach(function(followerObject) {
              if(followerObject.followee.equals(user._id)) {
                isFollowing = true;
              }
            });
            user.getTweets(function(err, soloTweet) {
              if(err) {
                res.status(500);
              } else {
                user.getFollows(function(err, userRelationships) {
                  if(err) {
                    res.status(500).send(err);
                  } else {
                    if(isFollowing) {
                      res.render('singleProfile', {
                        user, //fuck es6
                        isFollowing,
                        followers: userRelationships.followers,
                        followees: userRelationships.followees,
                        soloTweet,
                      });
                    } else {
                      res.render('singleProfile', {
                        user,
                        followers: userRelationships.followers,
                        followees: userRelationships.followees,
                        soloTweet,
                      });
                    }
                  }
                });
              }
            });
          } // end else in getFollows
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
  var viewer = req.user;
  Tweet.find()
    .populate('user')
    .exec(function(err, tweets) {
      if(err) {
        res.status(500).send('Could not find tweets from db');
      } else {
        viewer.getFollows(function(err, results) {
          var followObjArray = results.followees;
          var usersToDisplay = []; // all user ids for displayed tweets
          followObjArray.forEach(function(follow) {
            usersToDisplay.push(follow.followee);
          });
          usersToDisplay.push(viewer);
          tweets = tweets.filter(function(tweet) {
            var foundUser = false;
            for(let i = 0; i < usersToDisplay.length; i++) {
              if(usersToDisplay[i]._id.equals(tweet.user._id)) {
                foundUser = true;
                break;
              }
            } //end for
            return foundUser;
          }); //end filter
          res.render('tweets', {tweet: tweets, viewer: req.user});
        });
      }
    });
  // Displays all tweets in the DB
});

router.get('/tweets/new/', function(req, res, next) {
  res.render('newTweet', {viewer: req.user});
  //Display the form to fill out for a new tweet

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

router.post('/tweets/new', function(req, res, next) {
  // Handle submission of new tweet form, should add tweet to DB
  Tweet.create({
    user: req.user,
    content: req.body.content,
  }, function(err){
    if(err) {
      res.status(500).send('Failed to add Tweet to db');
    } else {
      res.redirect('/tweets/');
    }
  });
});

module.exports = router;
