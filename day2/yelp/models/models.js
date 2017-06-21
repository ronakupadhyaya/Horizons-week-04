var mongoose = require('mongoose');

// Mongoose connection --> Mlab
mongoose.connect(process.env.MONGODB_URI);

//
// Mongoose schemas
//

// Schema for defining collections of users
var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: String,
});

// Schema for 'follow' system
/*
Warning: Careful about creating duplicate follows!
You should be only creating a new Follows document if it doesn't already exist -
make sure this is handled in the routes below.
*/
var followSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  toUserId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
});

// End of schemas
//
// Methods for above schemas ^^
//

// Method for getting followers from a user document
userSchema.methods.getFollows = function (callback){
  // Save given user id
  var id = this._id
  // Finds list of users that given user is following
  module.exports.Follow.find({fromUserId: id}).populate('to').exec(function(err, following){
    // Error catch
    if(err)console.log(err);
    // Find the list of users following the given user
    module.exports.Follow.find({toUserId: id}).populate('from').exec(function(err, followers) {
      // Error catch
      if(err)console.log(err);
      console.log("Follow getter success");
      // Pass the two lists to the caller
      callback(followers, following)
    })
  })
};

// Method for creating a follow  document for a user to follow another
userSchema.methods.follow = function (idToFollow, callback){
  // Save the given users id
  var id = this._id
  // Find all the follows of the user
  module.exports.Follow.findOne({fromUserId: id, toUserId: idToFollow}, function(err, following){
    // If this document exists already, dont create new document
    if(following){
      console.log("Already following");
      // Follow protocol, create new follow doc
    } else {
      // Create the document
      var newFollow = new followSchema({
        fromUserId: id,
        toUserId: idToFollow
      })
      // Save the document
      newFollow.save(function(err){
        // Return to the caller and include an error param
        callback(err)
      })
    }
  })
};

// Unfollow user
userSchema.methods.unfollow = function (idToUnfollow, callback){
  // Save the given users id
  var id = this._id
  // Find the document for the follow
  module.exports.Follow.findOne({fromUserId: id, toUserId: idToFollow}).remove(function(err){
    callback(err)
  })
};

userSchema.methods.isFollowing = function(idToCheck, callback){
  var id = this._id
  module.exports.Follow.findOne({fromUserId: id, toUserId: idToCheck},function(err, follow){
    if (!follow) {
      callback(false)
    } else {
      callback(true)
    }
  })
}

var FollowsSchema = mongoose.Schema({

});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
