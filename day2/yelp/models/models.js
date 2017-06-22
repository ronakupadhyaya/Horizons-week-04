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

userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({to: myId})
    .populate('from')
    .exec(function(err, followers){
    if(err){
      callback(err);
    }
    else{
      Follow.find({from: myId})
        .populate('to')
        .exec(function(err, following){
        if(err){
          callback(err);
        }
        else{
          callback(null, {
            allFollowers: followers,
            allFollowing: following
          });
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  // new Follow({
  //   from: this._id,
  //   to: idToFollow
  // }).save(callback);
  var fromId = this._id;
  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
    if(err){
      callback(err);
    }
    else if(theFollow){
      callback(new Error('That follow already exists!'))
    }
    else {
      var newFollow = new Follow({
        from: fromId,
        to: idToFollow
      })
      newFollow.save(function(err, result){
        if(err){
          callback(err);
        }
        else{
          callback(null, result);
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToUnfollow} , callback);
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({from: this._id, to: id}, function(err, follow){
    if(err){
      console.log("This went wrong.");
    }
    else{
      callback(!!follow);
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

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
