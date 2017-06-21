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
  }
});

userSchema.methods.getFollows = function (id, callback){
  var myId= this.id;
  Follow.find({from:myId})
    .populate('to')
    .exec(function(err,allFollowing){
      if(err){
        callback(err);
      }
      else {
        Follow.find({to:myId})
          .populate('from')
          .exec(function(err,allFollowers){
          if(err){
            callback(err)
          }else {
            callback(null,{allFollowing: allFollowing,allFollowers:allFollowers})
            }
          })
      }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var fromId= this._id
  Follow.find({from:this._id, to:idToFollow},function(err,result){
    // console.log(result);
    //TODO Look at console.log/look at result!
    if(err){
      callback(err)
    }
    else if(result.length != 0){
      callback(new Error("That follow already exists"))
    }
    else {
      var newFollow =  new Follow ({
          from: fromId,
          to: idToFollow
        })
      newFollow.save(function(err, result) {
        if (err) {
          callback(err)
        }
        else{
          callback(null,result)
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from:this._id, to:idToUnfollow},function(err,result){
        if (err) {
          callback(err)
        } else{
          callback(null,result);
        }
      });
    }

var FollowsSchema = mongoose.Schema({
  from:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
});

var reviewSchema = mongoose.Schema({
  stars: Number,
  content: String,
  restaurant:{
    type:mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref: "User"
  }
});

var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  opentime: Number,
  closetime: Number,
  totalScore: Number,
  reviewCount: Number,
},
  {
    toObject: { virtuals: true },
    toJSON: { virtuals:true }
  }
);

restaurantSchema.methods.getReviews = function (restaurantId, callback){
 var myId= this.id;
 Review.find({restaurant: myId})
   .populate('user')
   .populate('restaurant')
   .exec(function(err,reviews){
   if(err){
     callback(err)
   } else {
     callback(null, reviews)
   }
 })
}

var avgVirtual =restaurantSchema.virtual('averageRating')

avgVirtual.get(function(){
  return (this.totalScore/this.reviewCount);
})

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
