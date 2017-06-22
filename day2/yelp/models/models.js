var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: String,
  email: String,
  password: String,
  location: String,
})


userSchema.methods.getFollows = function (id, callback){
  var allFollowers = []
  var allFollowing = []

  module.exports.Follow.find({from: this._id}).populate('from').exec(function(err, following){
    if(err) {
      console.log(err)
    }
    else {
      allFollowing = following
    }
  })
  module.exports.Follow.find({to: this._id}).populate('to').exec(function(err, followers) {
    if(err) {
      console.log(err)
    }
    else {
      allFollowers = followers
    }
  })
  callback(allFollowers, allFollowing);

}

userSchema.methods.follow = function (idToFollow, callback){
  var id = this._id
  module.exports.Follow.find({'to': idToFollow, 'from': id}, function(err, found) {
    if(found) {
      callback({error: "cannot follow"})
      return;
    }
    else {
      var newFollow = new Follow({
        from: id,
        to: idToFollow
      })
      newFollow.save(callback)
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  module.exports.Follow.find({'to': idToUnfollow, 'from': this._id}, function(err, found) {
    if(found) {
      found.remove(callback)
    }
    else {
      console.log(err)
    }
  })
}

userSchema.methods.isFollowing = function(userId, callback) {
  module.exports.Follow.find({'to': userId, 'from': this._id}, function(err, found) {
    console.log('found is here', found)
    if(found.length < 1) {
      callback(false)
    }
    else {
      callback(true)
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

//
