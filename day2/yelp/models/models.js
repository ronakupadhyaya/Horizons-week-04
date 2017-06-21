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
    // required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var following = [];
  var followedBy = [];
  var self = this;
  var myId = this.id;
  Follow.find({from: myId})
    .populate('to')
    .exec(function(err, allFollowing) {
      if (err) {
        callback(err);
      } else {
        Follow.find({to: myId})
        .populate('from')
        .exec(function(err, allFollowers) {
          if (err) {
            callback(err);
          } else {
            console.log("ing: "+allFollowing+" ers: "+allFollowers);
            callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
          }
        });
      }
    })
  ;
};
//add follow relationship if does not already exist
userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.findOne({from: this.id, to: idToFollow}, function(err, theFollow) {
    if (err) {
      callback(err);
    } else if (theFollow) {
      callback(null);
    } else {
      var follow = new Follow({
        to: idToFollow,
        from: self.id
      });
      follow.save(function(err, result) {
        console.log("SUCCESS FOLLOWING");
        callback(err);
      });
    }
  });

};
//unfollow a person: search Follow database to see if this relationship
// exists, remove if it does, log error if not;
userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this.id}, function(err) {
    if (err) {
      callback(err);
    } else {
      console.log("SUCCESS UNFOLLOWING");
      callback(null);
    }
  })
};
//check if this user is following argument user
userSchema.methods.isFollowing = function (user, callback){
  Follow.findOne({to: user.id, from: this.id}, function(err, thisFollow) {
    if (err) {
      console.log("error in finding following: "+err);
      callback(0);
    } else if (!thisFollow) {
      console.log("user is not following this person");
      callback(-1);
    } else {
      callback(1);
    }
  })
};
userSchema.methods.getReviews = function (callback){
  Review.find({user: this.id}, function(err, reviews) {
    callback(err, reviews)
  });
};

var FollowSchema = mongoose.Schema({
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
  stars: {
    type: Number,
    min: 1,
    max: 5,
    // required: true
  },
  content: {
    type: String,
    // required: true
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user:  {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

//create restaurant schema, with options to show the virtual
// var restaurantSchemaOptions = {
//
// }
var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  price: {
    type: Number,
    min: 1,
    max: 3,
    // required: true
  },
  category: {
    type: String,
    // required: true
  },
  latitude: {
    type: Number,
    // required: true
  },
  longitude: {
    type: Number,
    // required: true
  },
  openTime: {
    type: Number,
    min: 0,
    max: 23,
    // required: true
  },
  closingTime: {
    type: Number,
    min: 0,
    max: 23,
    // required: true
  },
  totalScore: {
    type: Number,
    // required: true
  },
  reviewCount: {
    type: Number,
    min: 0,
    // required: true
  }
}, {toJSON: { virtuals: true }});

var averageRatingVirtual = restaurantSchema.virtual('averageRating');
averageRatingVirtual.get(function() {
  return this.totalScore / this.reviewCount;
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {
  Review.find({restaurant: this.id})
    .populate('user')
    .exec(function(err, reviews) {
        callback(err, reviews);
      }
    );
};

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', FollowSchema)


// var follow1 = new Follow({
//   from: "59499a4dfd73521e55e30987",
//     to: "5949a922734d1d5397862196"
// });
// follow1.save(function(err) {
//   if (err) {
//     res.status(404).send(err);
//   } else {
//     console.log("success");
//   }
// })

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
