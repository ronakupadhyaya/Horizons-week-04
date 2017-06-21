var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: {
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

userSchema.methods.getFollowers = function (id, callback){
  var self=this;
  Follow.find({userFrom: self._id}).populate('userTo').exec(function(err,following){
    Follow.find({userTo: self._id}).populate('userFrom').exec(function(err, followers){
      callback(err, followers,following);
    })
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.find({userFrom:self._id, userTo: idToFollow}, function(err, follows) {
    if (err){
      callback(err);
    }else if (follows.length<=0){
      var follow = new Follow({
        userFrom: self._id,
        userTo: idToFollow
      });
      follow.save(callback)
    }
    else {
      callback(new Error("Already Following"));
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var self=this;
  Follow.find({userFrom: self._id, userTo:idToUnfollow }).remove().exec(callback);
}

userSchema.methods.getReviews = function (callback){
  var self=this;
  Review.find({userId: self._id}).populate('restId').exec(function(err,reviews){
    callback(err, reviews);
  })
}

var FollowsSchema = mongoose.Schema({
  userFrom:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  userTo:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
  }

});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restId:{
    type:mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  latitude:{
    type:Number
  },
  longitude:{
    type:Number
  },
  price:Number,
  openTime:Number,
  closeTime:Number,
  totalScore:{
    type:Number,
    default:0
  },
  reviewCount:{
    type:Number,
    default:0
  }
},{
  toJSON:{
    virtuals:true
  }
});

restaurantSchema.methods.getReviews = function (callback){
  var self=this;
  Review.find({restId: self._id}).populate('userId').exec(function(err,reviews){
    callback(err, reviews);
  })
}
// Review.find({restId: self.id }).populate('userId').exec( function(err, reviews) {
//   console.log(reviews);
//   var total = reviews.reduce(function(acc, obj) {
//     return acc + obj.stars;
//   }, 0);
//   console.log(total/reviews.length);
//   return (total/reviews.length);
// })
restaurantSchema.virtual("averageRating").get(function(){
  return (((this.totalScore/this.reviewCount)/5)*100)

})

// restaurantSchema.methods.stars = function(callback){
//   Review.find( {restaurant: this.id }).populate('user').exec( function(err, reviews) {
//     var total = reviews.reduce(function (acc, obj) {
//       return acc + obj.stars;
//     }, 0);
//     callback(err, (total/reviews.length));
// });
// }

var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', FollowsSchema)
module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
