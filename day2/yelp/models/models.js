var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName:{
    type:String,
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
  location: String
});

//getFollows(cb) - return array of followers and users followed as User objects in callback cb
userSchema.methods.getFollows = function (callback){ //find all the ones "from" me and then "to" me. one has to go inside the other "nest"
//   Follow.find({}, function() {
//     console.log('q');
//   })
//   Follow.find({}, function() {
//     console.log('p');
//   })
//   console.log('d');
// } incorect b/c async
 var fromId = this._id;
 Follow.find({from: fromId})  //from me
 .populate('to') //get info of who i am following, dont need copies of myself
.exec(function(error, allFollowing) {

    if (error) {
      callback(error)
    } else {
      Follow.find({to: myId})
      .populate('from')
      .exec(function(error, allFollowers) {
        if (error) {
          callback(error)
        } else {
          callback(null, {allFollowers: allFollowers, allFollowing: allFollowing})
        }
      })
    }
})
}

//follow(idToFollow, cb) - create and save a new Follow object with this._id as the from (see below) and idToFollow as to
//callback: to acess varibles stored, expected to be called with result
userSchema.methods.follow = function (idToFollow, callback){
  var fromID = this._id;
  Follow.find({from:this._id, to:idToFollow}, function (error, theFollow) {
    if (error) {
      callback(error);
    } else if (theFollow) {
      callback(new Error ("That follow already exists"));
    } else {
  var newFollow = new Follow ({
    to: idToFollow,
    from: this._id
  });
  newFollow.save(function(error, result) {
    if (error) {
      callback(error);
    } else {
      callback(null, result);    //same as doing callback(error, result) and also newFollow.save(callback) b/c newFollow.save(function(error, result) {callback(error, result)})
    }
  })
  }
})
};

//unfollow(idToUnfollow, cb) - find and delete a Follow object (if it exists!)
userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to: idToUnfollow, from: this._id}, function(error, result) {
    if (error) {
      callback(error)
    } else {
      callback(null, result);
    }
  })
};

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

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User =  mongoose.model('User', userSchema);
var Restaurant =  mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
