var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  }
  /* Add other fields here */
});

userSchema.methods.getFollows = function (callback) {

}
userSchema.methods.follow = function (idToFollow, callback) {
  console.log('Hello!')
  var Follow = {};
  Follow.follower = this._id;
  Follow.following = idToFollow;
  var newFollow = new Follow(Follow);
  newFollow.save(function (error) {
    if (error) {
      console.log('Follow could not be saved.');
    } else
      console.log('Followed successfully!')
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback) {

}
userSchema.methods.getTweets = function (callback) {

}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  following: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

tweetSchema.methods.numLikes = function (tweetId, callback) {

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
