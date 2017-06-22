var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: String,
  Location: String,
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
  //allFollowing = [];
  //allFollowers = [];
  Follow.find({from: id}).populate('from').exec(function(err, allFollowing){
    if(err){
      callback(err)
    }
    else{
      Follow.find({to: id}).populate('to').exec(function(err, allFollowers){
        if(err){
          callback(err);
        }
        else{
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
        }
        
      });
    }
  });
  
}

userSchema.methods.follow = function (idToFollow, callback){
  var follows = new Follow({
  from : this._id,
  to: idToFollow
  })
  Follow.findOne({from : this._id, to: idToFollow}).exec(function(err, follow){
    if(err){
      throw new Error("err")
    }
    else if(follow){
      throw new Error("already follow")
    }
    else{
      follows.save(callback);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToUnfollow}, callback(err, result))
}

var FollowsSchema = mongoose.Schema({
  from : {
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
var User = mongoose.model('User', userSchema);
var Restaurant= mongoose.model('Restaurant', restaurantSchema);
var Review= mongoose.model('Review', reviewSchema);
var Follow= mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
