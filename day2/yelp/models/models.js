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
  displayName:String,
  location:String
});

var FollowsSchema = mongoose.Schema({
  from:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  to:{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
});

var restaurantSchema = mongoose.Schema({
  name:String,
  category:String,
  latitude:Number,
  longitude:Number,
  price:Number,
  openTime:Number,
  closingTime:Number
});

var reviewSchema = mongoose.Schema({
  content:String,
  stars:Number,
  resId:{
    type:mongoose.Schema.ObjectId,
    ref:"Restaurant"
  },
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  }
});


userSchema.methods.getFollows = function (id, callback){
  var allFollowing = [];
  var allFollowers = [];
  console.log('aabbbb');
  Follow.find({from:id}).populate('to').exec(function(err,foundFollow) {
    allFollowing = foundFollow;
    console.log(allFollowing);
    Follow.find({to:id}).populate('from').exec(function(err,foundFollower) {
      allFollowers = foundFollower;
      console.log(allFollowers);
      callback(err,allFollowing,allFollowers);
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var self=this;
  Follow.findOne({from:self._id,to:idToFollow},function(err,follows){
    if(err)return callback(null);
    else{
        if(!follows){
          var follow=new Follow({
            from:self._id,
            to:idToFollow
          })
          follow.save(callback);
        }else callback(null);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({from:uid1, to: uid2}).remove(function(err) {
  callback(err)
  })
}

userSchema.methods.isFollowing=function(id,callback){
  Follow.find({from:this._id,to:id},function(err,follow){
    if(err)console.log(err);
    else{
      if(follow.length!=0)callback();
    }
  })
}

userSchema.methods.getReviews=function(id,callback){
  Reviews.find({userId:id}).populate('resId').exec(function(err, reviews){

    callback(reviews);
  })
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Reviews.find({resId:restaurantId}).populate('userId').exec(function(err,reviews){
    callback(reviews)
  })
}

var averageRating=restaurantSchema.virtual('averageRating');

averageRating.get(function(){
  var score=0;
  var count=0;
  this.getReviews(function(array){
    array.forEach(function(item){
      score+=item.stars;
      count++;
    })
    return score/count;
  })
})

var Restaurant=  mongoose.model('Restaurant', restaurantSchema);
var Reviews =  mongoose.model('Reviews', reviewSchema);
var Follow=  mongoose.model('Follow', FollowsSchema)


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant,
  Reviews,
  Follow
};
