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
    // required: true
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

userSchema.methods.follow = function(idToFollow, callback){
  var followEvent =  new Follow({
    followers:  this._id, // { type: mongoose.Schema.ObjectId, ref: 'User' },
    following:  idToFollow// { type: mongoose.Schema.ObjectId, ref: 'User' }
  })
  followEvent.save(function(error, results){
    if(error){
      callback(error, null)
    } else {
      callback(null, results)
    }
  })

}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  Follow.findOne({followers: this._id, following: idToUnfollow}).remove().exec(function(error, results){
    if(error){
      callback(error, null)
    } else {
      callback(null, results)
    }
  })

}

userSchema.methods.getTweets = function(callback){

}

var FollowsSchema = mongoose.Schema({
  followers:  { type: mongoose.Schema.ObjectId, ref: 'User' },
  following:  { type: mongoose.Schema.ObjectId, ref: 'User' }
});


var tweetSchema = mongoose.Schema({

});

tweetSchema.methods.numLikes = function (tweetId, callback){

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Restaurant', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
