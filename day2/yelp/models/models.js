var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: {
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
  location: String
});

userSchema.methods.getFollowers = function (id, callback){
  var self=this;
  Follow.find({userFrom: self._id}).populate('userTo').exec(function(err,following){
    Follow.find({userTo: self._id}).populate('userFrom').exec(function(err, followers){
      callback(err, followers,following);
    })
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.find({userFrom:self._id, userTo: idToFollow}, function(err, follows) {
    if (err){
      callback(err);
    }else if (follows.length<=0){
      var follow = new Follow({
        userFrom: self._id,
        userTo: idToFollow
      });
      follow.save(callback)
    }
    else {
      callback(new Error("Already Following"));
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self=this;
  Follow.find({userFrom: self._id, userTo:idToUnfollow }).remove().exec(callback);
}

var FollowsSchema = mongoose.Schema({
  userFrom:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  userTo:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  }

});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restId:{
    type:mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  latitude:{
    type:Number
  },
  longitude:{
    type:Number
  },
  price:Number,
  openTime:Number,
  closeTime:Number
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
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
