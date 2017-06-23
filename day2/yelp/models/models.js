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
  location: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (id, callback){

  var following;
  var followers;

  Follow.find({UserIdFrom: this._id})
    .populate('to')
    .exec(function(err, following){
      following = following;
    }

  Follow.find({UserIdTo: this._id})
    .populate('from')
    .exec(function(err, followers){
      followers = followers;
    }

  callback(followers, following);

  }


userSchema.methods.follow = function (idToFollow, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: idToFollow}, function (err, follow) {
    if (err) {
      callback(err, null);
    }
    else if (follow) {
      callback(null, null);
    }
    else if (!follow) {
      var follow = new Follow ({UserIdFrom: this._id, UserIdTo: idToFollow})
      follow.save(function(err,doc){
        callback(null,doc)
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: idToFollow}, function (err, follow) {
    if (err) {
      callback(err, null);
    }
    else if (!follow) {
      callback(null, null);
    }
    else if (follow) {
      follow.remove(callback);
      })
    }
  }

userSchema.methods.isFollowing = function (id, callback){
  Follow.findOne({UserIdFrom: this._id, UserIdTo: id}, function (err, follow) {
    if (err) {
      callback(err, null);
    }
    else if (follow) {
      callback(null, true);
    }
    else if (!follow) {
      callback(null, false);
      })
}

var FollowsSchema = mongoose.Schema({
  UserIdFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
  UserIdTo: {
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

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
