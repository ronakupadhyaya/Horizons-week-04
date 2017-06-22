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
  },
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  }
});

<<<<<<< HEAD
userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  console.log('myId', this._id);
  Follow.find({from: myId})
  .populate('to')
  .exec(function(err, allFollowing) {
    console.log('allFollowing', allFollowing);
    if(err) {
=======
// var followSchema = mongoose.Schema({
//   from: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User'
//   },
//   to: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User'
//   },
// });


userSchema.methods.getFollows = function (callback) { // if this was a static then you will do function (id, callback)
  // How will this be called? Jeremy.getFollows() meaning everything that the object Jeremy has can be accessed through "this"
  // Will have an instance of a user and this method will be called? // Find is a static, Save is a method. User.find, Jeremy.save
  var myId = this._id;
  Follow.find({from: myId})
  .populate('to')
  .exec(function(err, allFollowing) {
    if (err) {
>>>>>>> master
      callback(err)
    } else {
      Follow.find({to: myId})
      .populate('from')
      .exec(function(err, allFollowers) {
<<<<<<< HEAD
        console.log('allFollowers', allFollowers);
        if(err) {
          callback(err)
        } else {
          console.log('completed');
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing});
        }
      })
    }
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id;
  console.log(`fromId is ${fromId}`);
  console.log(`idToFollow is ${idToFollow}`);
  Follow.find({from: this._id, to: idToFollow}, function(err,theFollow){
    if (err) {
      console.log(`first error occured`);

      callback(err);
    } else if (theFollow) {
      callback(new Error("That follow already exists!"));
    } else {
      var newFollow = new Follow({
        to: idToFollow,
        from: fromId
      });
      newFollow.save(function(err, result) {
        if(err) {
          console.log(`second error occured`);

          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this._id}, function(err,result) {
    if(err) {
=======
        if (err) {
          callback(err)
        } else {
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      });
    }
  });
}
userSchema.methods.follow = function (idToFollow, callback) {
  // This will create a follow
  var fromId = this._id;
  Follow.find({from: this._id, to: idToFollow}, function(err, theFollow){
      if (err) {
        callback(err);
      } else if (theFollow) {
        callback(new Error("That follow already exists"));
      } else {
        var newFollow = new Follow({
          to: idToFollow,
          from: fromId
        });
        newFollow.save(function(err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
      }
  });
    // could be written 2 other ways
    // 1. callback(err, result);
    // 2. .save (callback)
}

userSchema.methods.unfollow = function (idToUnfollow, callback) {
  Follow.remove({to: idToUnfollow, from: this_id}, function(err, results) {
    if (err) {
>>>>>>> master
      callback(err)
    } else {
      callback(null, result);
    }
  });
}

<<<<<<< HEAD
var FollowsSchema = mongoose.Schema({
=======
// a bunch of follows that have occured on the site

var followSchema = mongoose.Schema({
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

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
<<<<<<< HEAD
var Follow = mongoose.model('Follow', FollowsSchema);
=======
var Follow = mongoose.model('Follow', followSchema);
>>>>>>> master

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
