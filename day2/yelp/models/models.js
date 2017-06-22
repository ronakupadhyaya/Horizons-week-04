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
  displayName: String,
  location: String
});


var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({from:myId})
  .populate('to')
  .exec(function(err, allFollowing){
    if (err){
      callback(err)
    } else {
      Follow.find({to:myId})
      .populate('from')
      .exec(function(err, allFollowers){
        if(err){
          callback(err)
        } else{
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var self = this._id;
  Follow.find({to: idToFollow, from: self._id}, function(err, theFollow) {
    if(err){
      callback(err)
    } else if(theFollow) {
      callback(new Error("That follow already exists!"));
    } else {
      var newFollow = new Follow({
        to: idToFollow,
        from: self._id
      })
    }
  })
  newFollow.save(function(err, result){
    if(err) {
      callback(err)
    } else {
      callback(null, result)
    }
  })
}
  // same as --> newFollow.save(callback)
  // same as --> newFollow.save(function(err, result)){
  //              callback(err, result)
  //             });
// }
// }

userSchema.methods.unfollow = function (idToUnfollow, callback){
 Follow.remove({to: idToFollow, from: this._id}, function(err, result){
   if(err){
     callback(err)
   } else {
     callback(null, result)
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
var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', followSchema);
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
