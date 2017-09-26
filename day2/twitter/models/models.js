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

}
userSchema.methods.follow = function (idToFollow, callback){

}

userSchema.methods.unfollow = function (idToUnfollow, callback){

}
userSchema.methods.getTweets = function (callback){

}

var FollowsSchema = mongoose.Schema({

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
