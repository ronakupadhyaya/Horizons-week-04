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
  location: String
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({from: id})
        .populate('to')
        .exec(function(err, allFollowing){
          Follow.find({to: id})
                .populate('from')
                .exec(function(err, allFollowers){
                  callback(allFollowing, allFollowers);
                })
        })

}

userSchema.methods.follow = function (idToFollow, callback){
  Follow.find({from: this._id, to: idToUnfollow}, function(err, obj){
    if(obj || err){
      // do nothing, the follow already exists or there is an error
    } else {
      var follow = new Follow({
        from: this._id,
        to: idToFollow
      });
      follow.save(callback);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({from: this._id, to: idToUnfollow})
        .remove(function(err){
          callback(err);
        })
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.find({from: this._id, to: id}, function(err, obj){
    if(obj){
      callback(false);
    } else if (err){
      console.log('Error');
    } else {
      callback(true);
    }
  })
}

var followSchema = mongoose.Schema({
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
