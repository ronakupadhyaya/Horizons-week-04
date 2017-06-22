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
  displayName: {
    type: String,
    required: true
  },
  location: String
});

userSchema.methods.getFollows = function (callback){
  var allFollowing = [];
  var allFollowers = [];
  Follow.find({UserIDFrom:this._id})
    .populate('UserIDFrom')
    .exec(function(err, arrIdFromObj){
    if(err){
      console.log("there was an error findById - From")
    }else{
      allFollowing = arrIdFromObj
      Follow.find({UserIDTo:this._id})
      .populate('UserIDTo')
      .exec(function(err, arrIdFromObj){
        if(err){
          console.log("there was an error findById - From")
        }else{
          allFollowers = arrIdFromObj
          callback(allFollowers, allFollowing)
        }
      })
    }
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  //sarah.follow(brian._id, function(err) { res.render('index') })
  Follow.findOne({UserIDFrom:this._id, UserIDTo:idToFollow}, function(err, followObj){
      if(followObj){
        callback();
      }else{
        var newFollow = new Follow({
          UserIDFrom: this._id,
          UserIDTo:idToFollow
        })
        newFollow.save(function(err){
          if(!err){
            console.log(err)
          }
        })
        callback();
      }
    })
  }

userSchema.methods.unfollow = function (idToUnfollow, callback){
//this._id is the 'this' to the left of the unfollow
  Follow.findOne({UserIDFrom:this._id, UserIDTo:idToFollow}, function(err, followObj){
    if(followObj){
      Follow.remove({UserIDTo: idToUnfollow}), function(err){
        if(err){
          console.log("Failed to remove")
        }else{
          callback();
        }
      }
    }else{
      console.log("You have never followed them")
      callback();
    }
  })
}

userSchema.methods.isFollowing = function(idToCheck, callback){
  Follow.findOne({UserIDFrom:this._id, UserIDTo:idToCheck}, function(err, followingObj){
    if(err){
      console.log("There was an error in checking if user is Following method")
    }else{
      if(followObj){
        callback(true)
      }else{
        callback(false)
      }
    }
  })
}

var FollowsSchema = mongoose.Schema({
  UserIDFrom: { // User A - clicked to follow
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  UserIDTo:{ // User B - recieved new follower
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

var Follow = mongoose.model('Follow', FollowsSchema)

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
