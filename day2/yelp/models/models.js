var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  dispName: {
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
    required: false
  }
});

userSchema.methods.getFollows = function (id, callback){
  var self = this._id
  //
  // Follow.find().populate('followed').exec({follower: id}, function(err, user){
  //   if (err){console.log("CAN'T GET IT: " + err)}
  //   else if (user){
  //     allFollowing.push(user)
  //   }
  // })
  // Follow.find().populate('follower').exec({followed: id}, function(err, user){
  //   if (err){console.log("CAN'T GET IT: " + err)}
  //   else if (user){
  //     allFollowers.push(user)
  //   }
  // })

Follow.find({follower: id}).populate('followed').exec(function(err1, user1){
  if(err1){console.log("THIS IS THE ERROR " + err1)}
  else{
  Follow.find({followed: id}).populate('follower').exec(function(err, user2){
    if (err){console.log("THIS IS THE ERROR 2: " + err)}
    else{
      callback(null, {allFollowing: user1, allFollowers: user2})
    }
  })
}
})

}
userSchema.methods.follow = function(idToFollow){
  Follow.find({followed: idToFollow}, function(err, users){
    if(err){console.log("FOLLOW FUNCTIONALITY LOST: " + err)}
    else if(users.follower === this._id){console.log("You are already following them")}
    else {
      var newfoll = new Follow({
        follower: this._id,
        followed: idToFollow
      })
      newfoll.save(function(err){
        if(err){console.log("CAN'T SAVE FOLLOWER B/C: "+err)}
      })
    }
  })
  //New --> save -->
}.bind(this)

userSchema.methods.unfollow = function(idToUnfollow){
  Follow.find({followed: idToUnfollow}, function(err, currfollowed){
    if (error){console.log("CAN'T UNFOLLOW BECAUSE: " + error)}
    else if (idToUnfollow !== currfollowed.followed){
      console.log("You must follow before you can unfollow")
    }else{Follow.remove({follower: this._id,followed: idToUnfollow}, function(err){
      if (err){console.log("THIS IS YOUR REMOVE PROBLEM: " + err)}
    })}
  })
}.bind(this)

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  followed: {
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
var Follow = mongoose.model('Follow', FollowsSchema)


module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
