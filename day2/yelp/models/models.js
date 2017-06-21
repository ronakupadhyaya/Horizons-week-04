var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

// <---------------------  USER SCHEMA ----------------------->
var userSchema = mongoose.Schema({
  username: {           // Could be a first name, last name, nickname, etc.
    type: String,
    required: true
  },
  email: {              // Email used for authentication
    type: String,
    required: true
  },
  password: {           // Hashed password used for authentication
    type: String,
    required: true
  },
  location: {           // A descriptive location for a User (a bio, of sorts)
    type: String
  }
});

/**
  This function takes a user id called, id, and returns a Follow obj
**/
userSchema.methods.getFollows = function (callback){
  var id = this._id;
  // Get ALL the people the user follows.
  var following;
  Follow.find({'fromId': id})
    .populate("User")
    .exec(function(err,users){
      following = users;
    });

  // Get ALL of the people that follow the user.
  var followers;
  Follow.find({'toId': id})
    .populate("User")
    .exec(function(err, users){
      followers = users;
    });

    callback(following, followers);
}

userSchema.methods.follow = function (idToFollow, callback) {
  this.findById(idToFollow, function(exists) {
    if(!exists) {
      callback("The person you are trying to follow doesnt exist!");
    } else {
      // Check if already following
      this.isFollowing(idToFollow, function(isFollowed) {
        if(isFollowed) {
          // We dont do anything
          callback("You are already following that person!");
        } else {
          // We are going to make a new Follow and save it!
          var newFollow = new Follow({
            fromId: this._id,
            toId: idToFollow
          });
          newFollow.save();
          callback("You have followed " + idToFollow + "!")
        }
      });
    }
  });

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.findById(idToUnfollow, callback);
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  this.findById({
    'fromId': idToCheck,
    'toId': this._id
  }, function(err, found) {
    if(!found) {
      callback(false);
    } else {
      callback(true);
    }
  });
}
// <---------------------  END OF USER SCHEMA ----------------------->

/* <-------------------- Follows Schema! ------------------------------>
 *  WARNING!!!!!!: Careful about creating duplicate follows!
 *  You should be only creating a new Follows document if it doesn't already exist.
 *  Make sure you handle this in your routes!
 */
var followSchema = mongoose.Schema({
  fromId: {            // The ID of the user that follows the other.
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  toId: {             // The ID of the user being followed.
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});
// <-------------------- END OF FOLLOWS SCHEMA! ------------------------------>

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
