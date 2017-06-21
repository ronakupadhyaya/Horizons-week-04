var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
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

}
userSchema.methods.follow = function (idToFollow, callback){

}

userSchema.methods.unfollow = function (idToUnfollow, callback){

}

var FollowsSchema = mongoose.Schema({
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: Number,
  openTime: Number,
  closeTime: Number
});


userSchema.methods.getFollows = function(id, callback) {
//  for async if we want things
}

userSchema.methods.follow = function(idToFollow, callback) {
  var selfId = this._id;
  Follow.find({from: selfId, to: idToFollow}, function(err, theFollow){
    if(err){
      callback(err);
    } else if (theFollow){
      callback(new Error("That follow already exists!"));
    } else {
      var newFollow = new Follow({
        to: idToFollow,
        from: selfId
      });
      newFollow.save(function(error, result){
        if(error){
          callback(error);
        } else {
          callback(result);
        }
      });
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  Follow.remove({to: idToUnfollow, from: this._id}, function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result);
    }
  });
}


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
