var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
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
  //get all followers and users user is following
  console.log("goes into this method");
  Follow.find({'from': id}).populate('to').exec(function(err, allFollowing) {
    if (err) {console.log(err)} else {
      Follow.find({'to': id}).populate('from').exec(function(err, allFollowers) {
        if (err) {console.log(err)} else {
          console.log("ALLFOLLOWING", allFollowing);
          console.log("ALLFOLLOWERS", allFollowers);
          callback(err, allFollowers, allFollowing);
        }
      });
    }
  });
}

userSchema.methods.follow = function (idToFollow, callback) {
  //will follow person with idToFollow
//   Follow.find({'from': this._id, 'to': idToFollow}, function(err, user) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (user.length > 0) { //already following user, don't need to do anything
//       console.log("already following user:", user);
//     } else {        //have to follow user
//       var newObj = new Follow({
//         from: this._id,
//         to: idToFollow
//       });
//       newObj.save(callback);
//     }
//   }
// })
Follow.find({'from': this._id, 'to': idToFollow}).exec(function(err, user) {
  if (err) {
    console.log(err);
  } else {
    console.log("USER IS", user)
    if (user.length > 0) { //already following user, don't need to do anything
    console.log("already following user:", user);
  } else {        //have to follow user
    var newObj = new Follow({
      from: this._id,
      to: idToFollow
    });
    newObj.save(callback);
  }
}
})
}



userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({'from': this._id, 'to': idToUnfollow}, function(err, user) {
    if (err) {console.log(err)} else  {
      if (user) {
        //want to delete user
        Follow.remove({'from': this._id, 'to': idToUnfollow}, function(err) {
          if (err) {console.log(err)};
        });
      }
    }
  })
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  Follow.find({'from': this._id, 'to': idToCheck}, function(err, user) {
    if (err) {console.log(err)} else {
      if (user) {
        callback(true);
      } else {
        callback(false);
      }
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
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
