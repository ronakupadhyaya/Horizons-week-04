var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
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
  },
  isFollowingUser: {
    type: Boolean
  }
});


userSchema.methods.getFollows = function (id, callback){
  var allFollowers = [];
  var allFollowing = [];
  Follow.find({userIdTo: id})
  .populate('userIdFrom')
  .exec(function(err, followers) {
    if (err) {
      res.json({failure: err})
    } else {
      followers.forEach(function(follower) {
        allFollowers.push(follower);
      })
      Follow.find({userIdFrom: id})
      .populate('userIdTo')
      .exec(function(err, followings) {
        if (err) {
          res.json({failure: err})
        } else {
          followings.forEach(function(following) {
            allFollowing.push(following);
          })
          callback(allFollowers, allFollowing);
        }
      })
    }
  })


}
userSchema.methods.follow = function (idToFollow, callback){
  var ourId = this.id;
  Follow.find({userIdFrom: this.id, userIdTo: idToFollow}, function(err, docs) {
    if (err) {
    } else {
      if (docs.length<1) {
        var newFollows = new Follow ({
          userIdTo: idToFollow,
          userIdFrom: ourId
        });
        newFollows.save(function(err) {
          if (err) {
            console.log({failure: "Error, cannot save", err})
          } else {
            console.log({success: "You saved the follow!"})
          }
        })
      } else {
        console.log({failure: "You have already followed this person!"})
      }
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  console.log("STEP1");
  Follow.findOne({userIdFrom: this.id, userIdTo: idToUnfollow}, function(err, doc) {
    console.log("DOC", doc);
    if (err) {
      console.log({failure: err});
    } else {
      console.log("STEP2");
      if (!doc) {
        console.log({failure: "You have not yet followed this person!"})
      } else {
        console.log("STEP3");
        doc.remove(function(err) {
          if (err) {
            console.log({failure: "Error, cannot remove", err})
          } else {
            console.log("STEP4");
            console.log({success: "You unfollowed!"})
          }
      })
    }
  }
})
}

userSchema.methods.isFollowing = function (id){
  Follow.findOne({userIdFrom: this.id, userIdTo: id}, function(err, doc) {
    var isFollowing;
    if (err) {
      res.json({failure: err});
    } else {
      if (!doc) {
        isFollowing = false;
      } else {
        isFollowing = true;
        return isFollowing;
      }
    }
  })
}




var FollowsSchema = mongoose.Schema({
  userIdFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  userIdTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isFollowing: {
    type: Boolean
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number
  },
  address: {
    type: String
  },
  openTime: {
    type: String
  },
  closeTime: {
    type: String
  },
  longitude:{
    type: Number
  },
  latitude:{
    type: Number
  }

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
