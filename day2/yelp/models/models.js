var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: String
});

// Followers
userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({from: myId})
  .exec(function(err, allFollowing){
    if(err) {
      callback(err)
    } else {
      Follow.find({to: myId})
      .exec(function(err, allFollowers){
        if(err) {
          callback(err)
        } else {
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }
  })
}

// Following
userSchema.methods.follow = function (idToFollow, callback){
  var fromId=this._id

  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
    if(err) {
      callback(err)
    } else if(theFollow) {
      callback(new Error("That follow alreay exists"))
    } else {
        var newFollow = new Follow({
          to: idToFollow,
          from: this._id
        });
    }

      newFollow.save(function(err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result)
          }
        });
      })
      }


userSchema.methods.unfollow = function (idToUnfollow, callback){
}

var FollowsSchema = mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
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

var User = mongoose.model('User', userSchema);
var Restaurant =  mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
