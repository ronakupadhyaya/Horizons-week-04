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
  displayName: String,
  location: {
    type: String,
    required: true
  }
});


userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({fromUser: myId })
    .populate('toUser')
    .exec(function(err, allFollowing){
      if(err){
        callback(err)
      } else{
        Follow.find({toUser: myId})
        .populate('fromUser')
        .exec(function(err, allFollowers){
          if(err){
            callback(err)
          } else{
            callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
          }
        })
      }
    })
}

userSchema.methods.follow = function (idToFollow, callback){
var fromId = this._id;
  Follow.find({fromUser: this._id, toUser: idToFollow}, function(err, theFollow){
    if(err){
      callback(err)
    } else if (theFollow){
      callback(new Error("That follow already exists!"))
    } else{
      var newFollow = new Follow({
        toUser: idToFollow,
        fromUser: fromId
      });
    }
  })
  newFollow.save(function(err, result){
    if(err){
      callback(err);
    } else{
      callback(null, result);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({toUser: idToUnfollow, fromUser: this._id}, function(err,result){
    if(err){
      callback(err)
    } else{
      callback(null,result);
    }
  });

  }


var FollowsSchema = mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  toUser: {
    type:mongoose.Schema.ObjectId,
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
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
