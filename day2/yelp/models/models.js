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
  displayName: String,
  location: {
    type: String,
    required: true
  }
});

<<<<<<< HEAD
var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
})

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId
});

userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  // console.log('myId', this._id);
  Follow.find({from: myId})
  .populate('to')
  .exec(function(err, allFollowing) {
    // console.log('allFollowing', allFollowing);
    if(err) {
      callback(err)
    } else {
      Follow.find({to: myId})
      .populate('from')
      .exec(function(err, allFollowers) {
        // console.log('allFollowers', allFollowers);
        if(err) {
          callback(err)
        } else {
          // console.log('completed');
          callback(null, { allFollowers: allFollowers, allFollowing: allFollowing});
        }
      })
    }
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var fromId = this._id;
  Follow.find({from: this._id, to: idToFollow}, function(err,theFollow){
    if (err) {
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
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  })
=======

userSchema.methods.getFollows = function (callback){
  var myId = this._id;
  Follow.find({fromUser: myId })
    .populate('toUser')
    .exec(function(err, allFollowing){
      if(err){
        callback(err)
      } else{
        Follow.find({toUser: myId})
        .populate('fromUser')
        .exec(function(err, allFollowers){
          if(err){
            callback(err)
          } else{
            callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
          }
        })
      }
    })
}
>>>>>>> master

userSchema.methods.follow = function (idToFollow, callback){
var fromId = this._id;
  Follow.find({fromUser: this._id, toUser: idToFollow}, function(err, theFollow){
    if(err){
      callback(err)
    } else if (theFollow){
      callback(new Error("That follow already exists!"))
    } else{
      var newFollow = new Follow({
        toUser: idToFollow,
        fromUser: fromId
      });
    }
  })
  newFollow.save(function(err, result){
    if(err){
      callback(err);
    } else{
      callback(null, result);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
<<<<<<< HEAD
  Follow.remove({to: idToUnfollow, from: this._id}, function(err,result) {
    if(err) {
      callback(err)
    } else {
      callback(null, result);
    }
  });
}

userSchema.methods.getReviews = function(){
=======
  Follow.remove({toUser: idToUnfollow, fromUser: this._id}, function(err,result){
    if(err){
      callback(err)
    } else{
      callback(null,result);
    }
  });

  }


var FollowsSchema = mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  toUser: {
    type:mongoose.Schema.ObjectId,
    ref: 'User'
  }
});
>>>>>>> master

}

var FollowsSchema = mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
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

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);


module.exports = {
  User: User,
<<<<<<< HEAD
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
=======
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
>>>>>>> master
};
