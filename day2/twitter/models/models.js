var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
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

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
userSchema.methods.getFollows = function (callback){
  var userId = this._id
  Follow.find({follower: userId}).populate('following').exec(function(err, follows){
    Follow.find({following: userId}).populate('follower').exec(function(err, followed){
      callback({err: err, followed: followed, follows: follows});
    })
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var userId = this._id;
  if(idToFollow !== userId){
    Follow.findOne({follower: this._id, following: idToFollow}, function(err, alreadyFollowed){
      if(err){
        callback(err, null)
      } else{
        if(alreadyFollowed){
          callback("already followed", null);
        } else{
          var follow = new Follow({
            follower: userId,
            following: idToFollow
          });
          follow.save(callback);
        }
      }
    })
  } else{
    callback("You can't follow yourself", null);
  }

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var userId = this._id;
  Follow.findOne({follower: userId, following: idToUnfollow}).remove(function(err, resp){
    if(err){
      callback(err, null);
    } else{
      callback(null, resp);
    }
  })

}
userSchema.methods.getTweets = function(callback){
  Tweet.find({user: this._id}).populate('user').exec(function(err, tweets){
    if(err){
      throw err;
    } else {
      callback(tweets);
    }
  })
}

userSchema.methods.isFollowing = function(user, callback){
  Follow.findOne({following: user.id, follower: this._id}, function(err, follow){
    if(err){
      callback(err, null);
    } else{
      if(!follow){
        callback(null, {isFollowing: false})
      } else{
        callback(null, {isFollowing: true});
      }
    }
  })
}

var FollowsSchema = mongoose.Schema({
  follower:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  following: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var tweetSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  content:{
    type: String,
    maxLength:140
  }
});

tweetSchema.methods.numLikes = function (tweetId, callback){

}


var User = mongoose.model('User', userSchema);
var Tweet = mongoose.model('Tweet', tweetSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Tweet: Tweet,
  Follow: Follow
};
