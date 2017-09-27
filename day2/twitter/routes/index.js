var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res) {
  res.redirect(`/users/${req.user._id}`)
})

router.get('/users/', function(req, res, next) {

  // Gets all users
  User.find(function(error, users) {
    if (error) {
      res.send(`Error: ${error}`)
    } else {
      res.render('profiles', {
        users: users
      })
    }
  })

});

router.get('/users/:userId', function(req, res, next) {

  // Gets all information about a single user
  User.findById(req.params.userId, function(error, user) {
    user.getFollows(function(followers, following) {
      Follow.findOne({
        follower: req.user.id,
        following: user.id
      }, function(err, follow) {
        // console.log(following);
        res.render('singleProfile', {
          user: user,
          isSelf: req.user.id === req.params.userId,
          follow: follow ? true : false,
          followings: following,
          followers: followers
        })
      })
    })
  })
});

router.post('/users/:userId', function(req, res, nes) {
  if (req.body.fol === 'Follow') {
    req.user.follow(req.params.userId, function(error) {
      if (error) {
        res.send(`Error: ${error}`);
      } else {
        res.redirect(`/users/${req.params.userId}`);
      }
    })
  } else {
    req.user.unfollow(req.params.userId, function(error) {
      if (error) {
        res.send(`Error: ${error}`);
      } else {
        res.redirect(`/users/${req.params.userId}`);
      }
    })
  }
})

router.post('/unfollow/:userId', function(req, res) {
  req.user.unfollow(req.params.userId, function(error) {
    if (error) {
      res.send(`Error: ${error}`);
    } else {
      res.redirect(`/users/${req.user.id}`);
    }
  })
})

router.get('/tweets/', function(req, res, next) {

  // Displays all tweets in the DB
  req.user.getFollows(function(followers, following) {
    following = following.map(function(follow) {
      return JSON.stringify(follow.following._id);
    })
    following.push(JSON.stringify(req.user.id));
    Tweet.find().populate('author').exec(function(error, tweets) {
      tweets = tweets.filter(function(tweet) {
        return following.includes(JSON.stringify(tweet.author._id));
      })
      res.render('tweets', {
        tweets: tweets
      })
    })
  })

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

// router.get('/tweets/new', function(req, res, next) {
//
//   //Display the form to fill out for a new tweet
//
// });

router.post('/tweets/new', function(req, res, next) {

  // Handle submission of new tweet form, should add tweet to DB
  var tweet = new Tweet({
    content: req.body.message,
    author: req.user.id
  })
  tweet.save(function(error) {
    if (error) {
      res.send(`Error: ${error}`)
    } else {
      res.redirect(`/tweets`);
    }
  })

});

module.exports = router;
