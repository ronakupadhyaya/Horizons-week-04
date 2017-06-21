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

var followsSchema = mongoose.Schema({
  to: {
    type:mongoose.Schema.ObjectId,
    ref: "User"
  },
  from: {
    type:mongoose.Schema.ObjectId,
    ref: "User"
  }
})


userSchema.methods.getFollows = function (callback){
  // 'this' will contain all about Grahan object. we always have to call graham.getFollows()
  var myId = this._id;
  Follow.find({from: myId}).populate('to').exec(function(err, allFollowing){
    if (err){
      callback(err);
    }
    else{
      Follow.find({userIdTO: myId}).populate('from').exec(function(err, allFollowers){
        if (err){
          callback(err)
        }
        else{
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      });
    }
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id
  Follow.find({from: this._id, to:idToFollow}, function(err, theFollow){
    if (err){
      callback(err)
    }
    else if(theFollow){
      callback(new Error("That follow already exists!"));
    }
    else {
      var newFollow = new Follow({
        to : idToFollow,
        from : fromId
      });
      newFollow.save(function(err, result){
        if (err){
          callback(err);
        }
        else{
          callback(null, result);
        }
      });
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to:idToUnfollow, from: this._id}, function(err, result){
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
  name: {
    type: String
  },
  category: {
    type: String
  },
  latitude: {
    type: Number
  },
  Longitude: {
    type: Number
  },
  price: {
    type: Number
  },
  openTime: {
    type: Number
  },
  closingTime: {
    type: Number
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}



//restaurantSchema.methods.stars = function(callback){
//
//}


var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
// var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followsSchema)
module.exports = {
  User: User,
  Restaurant: Restaurant,
  // Review: Review,
  Follow: Follow
};

// module.exports = {
//   User: mongoose.model('User', userSchema),
//   Restaurant: mongoose.model('Restaurant', restaurantSchema),
//   Review: mongoose.model('Review', reviewSchema),
//   Follow: mongoose.model('Follow', FollowsSchema)
// };
