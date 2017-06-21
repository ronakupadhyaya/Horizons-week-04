var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (id, callback){
  var followers
  var followings
  module.exports.Follow.find({from: this._id}).populate().exec(function(err, follows){
    if (err) {
      console.log("not following anyone")
    } else {
      followings = follows
    }
  })
  module.exports.Follow.find({to: this._id}).populate().exec(function(err,follows){
    if(err) {
      console.log("no followers")
    } else {
      followers = follows
    }
  })
  callback(followers,followings)
}
userSchema.methods.follow = function (idToFollow, callback){
  console.log(this._id)
  modules.exports.Follow.findOne({from: this._id, to: idToFollow}, function(err, follow){
    if(follow){
      console.log("follow already exists")
      return
    } else {
      var newFollow = new Follow({
        from: this._id,
        to: idToFollow
      })
      newFollow.save(function(err){
        if (err) {
          console.log("follow save error")
        } else {
          console.log("saved")
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  module.exports.Follow.remove({from: this._id, to: idToUnfollow}, function(err){
    if(err){
      console.log("follow doesn't exist")
    } else {
      console.log("removed")
    }
  })
}

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

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  Longitude: Number,
  Price: Number,
  openTime: Number,
  closingTime: Number
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
