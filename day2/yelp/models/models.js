var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var userSchemaOptions = {
//   toJSON:{
//     virtuals:true
//   }
// }

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
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

var FollowsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }

});

var Follow = mongoose.model('Follow',FollowsSchema );

//User methods for Followers

userSchema.methods.getFollows = function (id, callback){
  //getFollows(cb) - return array of followers and users followed as User objects in callback cb
  // This method will go through and find all Follow documents
  //that correspond to both user relationships where the user's ID (accessible by the caller of the function, this._id)
  var followingArr = [];
  var followersArr = [];
  var self = this;
  module.exports.Follow.find({
    from: self._id
  }).populate('to').exec(function(err, following){
    // followingArr = following;
    following.forEach(function(followings){
      followingArr.push(followings);
    })
    console.log(followingArr)

    module.exports.Follow.find({
      to: self._id
    }).populate('from').exec(function(err, followers){
      followers.forEach(function(followersings){
        followersArr.push(followersings);
      })
      // followersArr = followers;
      console.log(followersArr)
      callback( followingArr, followersArr);
    });
  });
}
userSchema.methods.follow = function (idToFollow, callback){ //id of person you're following
  // this method sets a following relationship
  //instance method that acts upon a user
  //save a new Follow object with this._id as the from (see below) and idToFollow as to
  var self = this;
  module.exports.Follow.find({
    from: self._id,
    to: idToFollow
  }, function(err, following){
      if(err) {
        console.log("ERROR IN FOLLOW");
        callback(null);
      }
      // console.log(following)
      if(following.length < 1) {
        var follows = new Follow ({
          from: self._id,
          to: idToFollow
        });
        follows.save(callback)
      } else {
        callback(null);
      }
    })

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  //unfollow(idToUnfollow, cb) - find and delete a Follow object (if it exists!)
  //this method deletes the relationship represented by a Follow document
  module.exports.Follow.find({
    from: this._id,
    to: idToUnfollow
  }).exec(function(err, followingFound){
    if(err){
      console.log('error here in unfollow');
      callback(null);
    } else {
      if(!followingFound) {
        console.log("please follow this person first, then you'll be able to unfollow")
      } else {
        module.exports.Follow.remove({
          from: this._id,
          to: idToUnfollow
        }, callback)
      }

    }
  });
}
userSchema.methods.isFollowing = function(userId, callback) {
  module.exports.Follow.find({
    to: userId,
    from: this._id
  }).exec(function(err, found){
    if(found < 1) {
      callback(false)
    } else {
      callback(true)
    }
  })
  // }), function(err, found) {
  //   console.log('found is here', found)
  //   if(found.length < 1) {
  //     callback(false)
  //   }
  //   else {
  //     callback(true)
  //   }
  // })
}

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  price: {
    type: Number
  },
  openTime: {
    type: Number
  },
  closeTime: {
    type: Number
  }
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
