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
    required: true
  }
});
userSchema.methods.getFollows = function (id, callback){
  Follow.find({from: id}).populate('to').exec(function(err, following){
    Follow.find({to: id}).populate('from').exec(function(err, followers){
      callback(following, followers)
    });
  });
};
userSchema.methods.follow = function (idToFollow, callback){
//You should take in a parameter idToFollow of the user to follow;
//now, calling .follow on the logged-in user will follow the user
//given by idToFollow! follow should also check if you have followed
//that user already and prevent you from creating duplicate Follow documents.
  Follow.find({from: this._id, to: idToFollow}).exec(function(err, doc){
    if(!doc){
      var n = new Follow({
        from: this_.id,
        to: idToFollow
      })
      n.save(callback)
    }
  })}
userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({to:idToUnfollow, from: this._id}.exec(function(err, doc){
    doc.remove()}));
};
userSchema.methods.isFollowing = function(isFollowedId, callback){
  if(Follow.findOne({from:this._id, to: isFollowedId})){
    return true
  }
  return false
}
var FollowsSchema = mongoose.Schema({
  // the ID of the user that follows the other
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    // the ID of the user being followed
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
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
