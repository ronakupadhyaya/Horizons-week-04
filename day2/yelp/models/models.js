var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName:{
    type:String,
    required:true
  },
  location:{
    type:String
  }
});


userSchema.methods.getFollows = function (callback){
  var id = this._id;
  Follow.find({to:id})
  .populate('from')
  .exec(function(err,followers){
    if(err){
      console.log(err)
    }else{
      Follow.find({from:id})
      .populate('to')
      .exec(function(err,follows){
        if(err){
          consol.log(err)
        }else{
          callback(followers,follows);
        }
      })
    }
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var follow = new Follow(this._id,idToFollow);
  follow.save(callback);

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({to:idToUnfollow, from:this._id},function(err,follow){
    if(err){
      console.log("follow not found");
    }else{
      console.log("follow succefully removed");
    }
  })
}
userSchema.methods.isFollowing = function(user){
  User.findOne({from:this._id, to:user._id},function(err,obj){
    if(err){
      console.log(err);
    }else if(!obj){
      return false;
    }else{
      return true;
    }
  })
}

var FollowsSchema = new mongoose.Schema({
  from:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'

  }
});

var reviewSchema = new mongoose.Schema({
  stars:{
    type:Number,
    enum:[1,2,3,4,5]
  },
  content:String,
  restaurant:String,
  user:String
});


var restaurantSchema = new mongoose.Schema({
  name:String,
  price:{
    type:Number,
    enum:[1,2,3]
  },
  category:String,
  Latitude:Number,
  Longitude:Number,
  openTime:{
    type:Number
  },
  closingTime:{
    type:Number
  },
  totalScore:Number,
  reviewCount:Number
});

// restaurantSchema.methods.getReviews = function ( callback){
//
// }

restaurantSchema.methods.getReviews = function(callback){
  Review.find({restaurant:this._id},function(err, reviews){
    if(err || !reviews){
      console.log(err);
    }else{
      callback(reviews);
    }
  })
}
userSchema.methods.getReviews = function(callback){
  Review.find({user:this._id},function(err, reviews){
    if(err || !reviews){
      console.log(err);
    }else{
      callback(reviews);
    }
  })
}
var averageRatingVirtual = restaurantSchema.virtual("averageRating");
averageRatingVirtual.get(function(){
  return this.totalScore/this.reviewCount;
})
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
