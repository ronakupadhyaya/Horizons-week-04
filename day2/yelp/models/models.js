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
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    // required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var allFollowing = [];
  var allFollowers = [];
  Follow.find({UserIdFrom:this._id})
  .populate('UserIdFrom')
  .exec(function(err, arrIdFromObj){
    if(err){
      console.log("error - there was an error finding by id from")
    } else{
      allFollowing = arrIdFromObj;
      Follow.find({UserIdTo:this._id})
      .populate('UserIdTo')
      .exec( function(err, arrIdFromObj){
          if(err){
            console.log("error - there was an error finding by id from")
          } else{
            allFollowers = arrIdFromObj;
            callback(allFollowers, allFollowing);
          }
        })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: idToFollow}, function(err, followObj){
    if (followObj){
      callback();
    } else{
      var newFollow = new Follow({
        UserIdFrom: this._id,//does this refer to the same this?
        UserIdTo: idToFollow
      })
      newFollow.save(function(err){
        if (!err){
          console.log("error - saving new follow")
        }
      })
      callback();
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: idToUnfollow}, function(err, followObj){
    if(followObj){
      Follow.remove({UserIdTo: idToUnfollow}, function(err){
        if(err){
          console.log("Failed to remove")
        } else{
          callback();
        }
      })
    } else{
      console.log("error - never followed in first place");
      callback();
    }
  })
}

userSchema.methods.isFollowing = function(userId, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: userId}, function(err, followingObj){
    if(err){
      console.log("there was an error in finding if user is followed")
    } else{
      if(followObj){
        callback(true)
      } else{
        callback(false)
      }
    }
  })
}

var FollowsSchema = mongoose.Schema({
  UserIdFrom: { //user A - Userclicked to follow
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  UserIdTo: { //user B - got new follower
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

var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
