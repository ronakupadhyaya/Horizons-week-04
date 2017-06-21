var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
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
    required: true,
  },
});

var FollowsSchema = new mongoose.Schema({
  //id of the user following another
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  //id of user being followed
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});


userSchema.methods.getFollows = function ( callback){
  var id = this._id;
  module.exports.Follow.find({'from': id}).populate('to').exec(function(err, foundLeaders){
    module.exports.Follow.find({'to': id}).populate('from').exec(function(err, foundFollowers){
      callback(err, foundLeaders, foundFollowers)
    })
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var id = this._id;

  Follow.find({'to': idToFollow, 'from': id}, function(err, found){
    if(found.length) {
      callback({error: "You are already following the user"})
      return;
    }else{

      var newFollow = new Follow({'from': id, 'to': idToFollow})
      console.log('new follow: ', newFollow)
      newFollow.save(callback)
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var id = this._id;
  module.exports.Follow.find({'to': idToUnfollow, 'from': id}).remove().exec(callback)
}

userSchema.methods.isFollowing = function(idIsFollowing, callback){
  module.exports.Follow.findOne({'to': idIsFollowing, 'from': this._id}, function(err, found){
    callback(err, !!found)
  })
}

var reviewSchema = new mongoose.Schema({

});


var restaurantSchema = new mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', FollowsSchema)
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
