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
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
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
  var self = this;
  Follow.find({follower:self._id}).populate('following').exec(function(err,allFollowing){ //Find all people this user is following
    if(err){
      callback(err,null,null);
    }
    else{
      if(!allFollowing){
        allFollowing = [];
      }
      Follow.find({following:self._id}).populate('follower').exec(function(err2,allFollowers){ //Find all people following this user
        if(err2){
          callback(err2,allFollowing,null);
        }
        else{
          if(!allFollowers){
            allFollowers = [];
          }
          callback(null,allFollowing,allFollowers);
        }
      });
    }
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  User.findById(idToFollow,function(err,userToFollow){
    if(err){
      callback(err);
    }
    else if(!userToFollow){
      callback('User to Follow Not Found');
    }
    else{
      Follow.findOne({following: idToFollow, follower: self._id},function(err2, foundFollow){
        if(err){
          callback(err);
        }
        else if(!foundFollow){
          var newFollow = new Follow({
            follower: self._id,
            following: idToFollow
          });
          newFollow.save(function(err3){
            if(err3){
              callback('Error: follow not created');
            }
            else{
              callback(null);
            }
          });
        }
        else{
          callback('User ' + self._id + ' is already following ' + idToFollow);
        }
      });
    }
  });
};

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self = this;
  Follow.findOne({following: idToUnfollow, follower: self._id},function(err, foundFollow){
    if(err){
      callback(err);
    }
    else if(!foundFollow){
      callback("Error: no follow to delete.");
    }
    else{
      Follow.deleteOne({_id:foundFollow._id},function(err2){
        if(err2){
          callback('Error: follow not deleted.');
        }
        else{
          callback(null);
        }
      });
    }
  });
};

userSchema.methods.getTweets = function (callback){

}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
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
