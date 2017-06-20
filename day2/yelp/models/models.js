var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: String,
  location: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var FollowsSchema = mongoose.Schema({
  to:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }

});

userSchema.methods.getFollows = function (callback){
  var myId = this._id
  //return array of followers and users followed as User objects in callback cb
  Follow.find({from: myId}).populate('to').exec(function(err, allFollowing){
    if(err){
      callback(err);
    }
    else{
      Follow.find({to: myId}).populate('from').exec(function(err, allFollowers){
        if(err){
          callback(err);
        }
        else{
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }

  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id;
  var newFollow = new Follow({
    to: idToFollow,
    from: fromId
  });
  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
    if (err){
      callback(err);
    }
    else if (theFollow){
      callback(new Error('that follow already exists'));
    }
    else{
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
  Follow.remove({to: idToUnfollow, from: this.id}, function(err, result){
    if(err){
      callback(err);
    }
    else{
      callback(null, result);
    }
  })
}

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}
var User = mongoose.model('User', userSchema),
var Restaurant = mongoose.model('Restaurant', restaurantSchema),
var Review = mongoose.model('Review', reviewSchema),
var Follow = mongoose.model('Follow', FollowsSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
