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
  displayName: String,
  location: String
});


userSchema.methods.isFollowing = function(userId, callback){
  Follow.findOne({userId1: this._id, userId2: userId}, function(err, person){
    if(person){
      callback(true);
    }
  });
}


userSchema.methods.getFollows = function(id, populate){
  var allFollowing = [];
  var allFollowers = [];

  Follow.find({userId1: this._id}).populate('userId2').exec(function(err, following){
    Follow.find({userId2: this._id}).populate('userId1').exec(function(err, follows){
      //push the other in each relationship into arrays
      for(var j = 0; j < following.length; j++) {
        allFollowers.push(following[j].userId2);
      }
      for (var i = 0; i < follows.length; i++){
        allFollowing.push(follows[i].userId1);
      }
      callback(err, allFollowers, allFollowing);
    })
  })
}


userSchema.methods.follow = function (idToFollow, callback){
  //if not already following
  //create new follow document
  Follow.findOne({userId1: this.id, userId2: idToFollow}, function(err, follow){
    if(!follow) {
      var newFollow = new Follow({
        user1: this.id,
        user2: idToFollow
      })
      newFollow.save(callback);
    }
    else {
      console.log("error you are already following" + idToFollow);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({userId1: this.id, userId2: idToUnfollow}, function(err, docs){
    if(err) {console.log('error hit when deleting follow');}
    else {
      docs.remove();
    }
  })
}

var FollowsSchema = mongoose.Schema({
  userId1: { //from
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  userId2: { //to
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
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
