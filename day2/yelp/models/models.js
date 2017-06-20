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
  }
  location: {
    type: String,
    required: false
  }
});

userSchema.methods.getFollows = function (id, callback){

}
userSchema.methods.follow = function(idToFollow){
  Follow.find({followed: idToFollow}, function(err, users){
    if(err){console.log("FOLLOW FUNCTIONALITY LOST: " + err)}
    else if(users.following === this._id){console.log("You are already following them")}
    else {
      var newfoll = new Follow({
        following: this._id,
        followed: idToFollow
      })
      newfoll.save(function(err){
        if(err){console.log("CAN'T SAVE FOLLOWER B/C: "+err)}
      })
    }
  })
}.bind(this)

userSchema.methods.unfollow = function(idToUnfollow{
  Follow.find({followed: idToUnfollow}, function(err, currfollowed){
    if (error){console.log("CAN'T UNFOLLOW BECAUSE: " + error)}
    else if (idToUnfollow !== currfollowed.followed){
      console.log("You must follow before you can unfollow")
    }else{Follow.remove({following: this._id,followed: idToUnfollow}, function(err{
      if (err){console.log("THIS IS YOUR REMOVE PROBLEM: " + err)}
    }))}
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


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
