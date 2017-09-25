var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

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

userSchema.methods.getFollows = function (callback){

}
userSchema.methods.follow = function (idToFollow, callback){

}

userSchema.methods.unfollow = function (idToUnfollow, callback){

}

var FollowsSchema = mongoose.Schema({

});


var tweetSchema = mongoose.Schema({

});

tweetSchema.methods.getReviews = function (tweetId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Restaurant', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
