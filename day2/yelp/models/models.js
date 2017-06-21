var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String
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
    type: String
  }
});

userSchema.methods.getFollows = function (callback){
  var myId = this._id
  Follow.find({from:myId})
  .populate('to')
  .exec(function(err, allFollowing){
    if(err) {
      callback(err) }
    else {

    Follow.find({to:myId})
    .populate('from')
    .exec(function(err, allFollowers) {
      if(err) {
        callback(err) }
      else {
        callback(null, {allFollowing:allFollowing, allFollowers:allFollowers}) }
      })
    }
  })
}

userSchema.methods.follow = function(idtoFollow, callback){
  var fromId = this._id
  Follow.find({from:this._id, to:idtoFollow}, function(err,theFollow) {
      if(err) {
        callback(err) }

      if(theFollow.length != 0) {
        callback(new Error("That follow already exists")) }

      else {
        var newFollow = new Follow ({
          from: fromId,
          to: idtoFollow
        })
        newFollow.save(function(err, theFollow) {
          if(err) {
            callback(err) }
          else {
            callback(null, theFollow) }
          })
          // newFollow.save(callback) COULD JUST DO THIS INSTEAD
        }
    })
  }


userSchema.methods.unfollow = function (idtoUnfollow, callback){
  Follow.remove({from:this._id, to:idtoUnfollow}, function(err, result) {
    if(err) {
      callback(err) }
    else {
      callback(null, result) }
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

var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  opentime: Number,
  closingtime: Number
});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

restaurantSchema.methods.getReviews = function(restaurantId, callback){
  Review.find({restaurantId:restaurantId})
  .populate('restaurantId')
  .exec(function(err, allReviews){
    if(err) {
      callback(err) }
    else {
      callback(null, allReviews) }
    })
  }





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
