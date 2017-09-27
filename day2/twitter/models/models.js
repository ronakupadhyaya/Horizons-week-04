var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  bio: {
    type: String,
  }
  /* Add other fields here */
});

userSchema.methods.getFollows = function(callback) {
  var self = this;
  Follow.find({
    follower: self.id
  }).populate('following').exec(function(error, allFollowing) {
    if (error) {
      res.send(`Error: ${error}`);
    } else {
      Follow.find({
        following: self.id
      }).populate('follower').exec(function(err, allFollowers) {
        if (err) {
          res.send(`Error: ${err}`);
        } else {
          callback(allFollowers, allFollowing);
        }
      })
    }
  })
}

userSchema.methods.follow = function(idToFollow, callback) {
  var follow = new Follow({
    follower: this.id,
    following: idToFollow
  })
  follow.save(function(err) {
    callback(err);
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  Follow.findOneAndRemove({
    follower: this.id,
    following: idToUnfollow
  }, function(error, follow) {
    callback(error, follow);
  })
}

userSchema.methods.getTweets = function(callback) {
  Tweet.find({
    author: this.id
  }).populate('author').exec(function(error, tweets) {
    callback(error, tweets)
  })
}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  following: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  }
});


var tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

tweetSchema.methods.numLikes = function(tweetId, callback) {

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
