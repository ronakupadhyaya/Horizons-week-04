var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

<<<<<<< HEAD
var userSchema = mongoose.Schema({
  displayName: String,
  location: String,
=======
var userSchema = new mongoose.Schema({
  displayName: String,
>>>>>>> master
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: String
});

userSchema.methods.getFollows = function(callback) {
<<<<<<< HEAD
  var myId = this._id;
  console.log('myId', this._id);
=======
  // var allFollowers = []
  // FollowsSchema.forEach(function(x) {
  //   if (x.to === id) {
  //     allFollowers.push({
  //       from: this._id,
  //       to: x.id
  //     })
  //   }
  // })
  var myId = this._id
>>>>>>> master
  Follow.find({
      from: myId
    })
    .populate('to')
    .exec(function(err, allFollowing) {
<<<<<<< HEAD
      console.log('allFollowing', allFollowing);
=======

>>>>>>> master
      if (err) {
        callback(err)
      } else {
        Follow.find({
            to: myId
          })
          .populate('from')
          .exec(function(err, allFollowers) {
<<<<<<< HEAD
            console.log('allFollowers', allFollowers);
            if (err) {
              callback(err)
            } else {
              console.log('completed');
              callback(null, {
                allFollowers: allFollowers,
                allFollowing: allFollowing
              });
=======
            if (err) {
              callback(err)
            } else {
              callback(null, {
                allFollowers: allFollowers,
                allFollowing: allFollowing
              })
>>>>>>> master
            }
          })
      }
    })
}
userSchema.methods.follow = function(idToFollow, callback) {
<<<<<<< HEAD
  var fromId = this._id;
=======
  // if (!idToFollow) {
  //   var following = new FollowsSchema({
  //     fromUser: {
  //       id1: this._id
  //     },
  //     toUser: {
  //       id2: idToFollow
  //     }
  //   })
  //   following.save(callback)
  // } else {
  //   callback(null)
  // }
  var fromId = this._id
>>>>>>> master
  Follow.find({
    from: this._id,
    to: idToFollow
  }, function(err, theFollow) {
    if (err) {
<<<<<<< HEAD
      callback(err);
    } else if (theFollow) {
      callback(new Error("That follow already exists!"));
=======
      callback(err)
    } else if (theFollow) {
      callback(new Error("That follow already exists"))
>>>>>>> master
    } else {
      var newFollow = new Follow({
        to: idToFollow,
        from: fromId
      });
<<<<<<< HEAD

      newFollow.save(function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  })

}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
=======
    }

    newFollow.save(function(err, result) {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    });
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback) {
  // if (idToUnfollow) {
  //   var following = new FollowsSchema({
  //     fromUser: {
  //       id1: this._id
  //     },
  //     toUser: {
  //       id2: idToUnfollow
  //     }
  //   })
  //   following.save(callback)
  // } else {
  //   callback(null)
  // }
>>>>>>> master
  Follow.remove({
    to: idToUnfollow,
    from: this._id
  }, function(err, result) {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  });
<<<<<<< HEAD
}

var FollowsSchema = mongoose.Schema({
=======

}

var FollowsSchema = new mongoose.Schema({
>>>>>>> master
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: {
    enum: [
      "American",
      "French",
      "General European",
      "Italian",
      "Carribbean",
      "Mexican"
    ]
  },
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number,

});

restaurantSchema.methods.getReviews = function(restaurantId, callback) {

}

//restaurantSchema.methods.stars = function(callback){
//
//}
<<<<<<< HEAD

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
=======
var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', FollowsSchema)
>>>>>>> master

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
