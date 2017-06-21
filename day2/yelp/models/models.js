var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

///USER_SCHEMA

var userSchema = mongoose.Schema({
  displayName: String,
  location: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

///USER_SCHEMA METHODS:
              //   getFollow   //
userSchema.methods.getFollows = function (callback){
  var id = this._id;
  Follow.find({from: id}.populate('to').exec(function(err, allFollowing){
    if(err) {
      callback(err);
    } else {
      Follow.find({to: id}).populate('from').exec(function(err, allFollowers){
        if(err) {
          callback(err);
        } else {
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
        }
      });
    }
  }));
}
              //   follow   //
userSchema.methods.follow = function (idToFollow, callback){
  var id = this._id;
    Follow.findOne({from: id, to: idToFollow}, function(err, user){
      if(err) {
        callback(err);
      }
      else if(user) {
        callback(new Error('you already followed them lmao'))
      } else {
        var f = new Follow({
          from: id,
          to: idToFollow
        });
        f.save(callback)
      }
    });
  }
                //   unfollow   //
userSchema.methods.unfollow = function (idToUnfollow, callback){
  var id = this._id;
  Follow.remove({from: id, to: idToUnfollow}, callback(err, result));
}
  //   function(err){
  //   if(err) {
  //     console.log("oops! that didn't work, you're still following them", err);
  //   }
  // })

              //   isFollowing  //
userSchema.methods.isFollowing = function (checkid, callback) {
  var id = this._id;
  Follow.findOne({from: id, to: idToFollow}, callback(err, result));
}
  //   function(err, user){
  //   if(user) {
  //     callback(null, true);
  //   } else {
  //     console.log("they're not following you babe", err);
  //     callback(err);
  //   }
  // }
////END OF USER_SCHEMA METHODS

////FOLLOWS_SCHEMA

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
});


var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  content: String,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name: String,
  price: {
    type: Number,
    max: 3,
    min: 1
  },
  category: String,
  latitude: Number,
  longitude: Number,
  openTime: {
    type: Number,
    max: 23,
    min: 0
  },
  closingTime: {
    type: Number,
    max: 23,
    min: 0
  },
  totalScore: {
    type: Number,
    max: 5
  },
  reviewCount: Number
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
