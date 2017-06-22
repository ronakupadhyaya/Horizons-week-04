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
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  }
});

//get the users following a user and the users that the user is following
//id: user
userSchema.methods.getFollows = function (callback){
  // this.find()
  // console.log(this._id, id);
  var userId = this._id;


  Follow.find({from: userId}).populate('to').exec(function(error,following){
    if(error){
      callback(error)
    }else{
      //this finds the users this user follows
      Follow.find({to: userId}).populate('from').exec(function(error,followers){
        // following.populate('to')
        if(error){
          callback(error)
        }else{
          // console.log(followers,following);
          callback(null,{allFollowers: followers, allFollowing: following});
        }
      })
    }
  })
}


userSchema.methods.follow = function (idToFollow, callback){
  var userId = this._id;
  Follow.findOne({to: idToFollow, from: userId}, function(err, followObj){
    if(err){
      callback(err);
    }else if(followObj){ //if this following pair already exists, dont do anything
      callback(new Error("that follow exists"));
    } else{ //if they are not already following that user
      var follow = new Follow({to: idToFollow, from: userId})
      // follow.save(callback);
      follow.save(function(err,result){
        if(err){
          callback(err);
        }else {
          callback(null,result);
        }
      })
    }


  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var userId = this._id;
  console.log("unfollow called");
  Follow.remove({to: idToUnfollow, from: userId}, function(err,result){
    if(err){
      console.log("error unfollowing");
      callback(err);
    }else{
      callback(null,result);
    }
  });

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

var reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true
  },
  restaurantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  address: {
    type: String
  },
  latitude:{
    type:Number,
    required: true
  },
  longitude:{
    type:Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  openTime: {
    type: Number,
    required: true
  },
  closeTime:  {
    type:Number,
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  toJSON: {
    virtuals: true
  }
});

restaurantSchema.virtual("averageRating").get(function(){
  var result = (this.totalScore/this.reviewCount).toFixed(1);
  if(parseFloat(result)){
    // console.log("result is truthy for", this.name);
    return result;
  }else{
    return 0;
  }
  // console.log("virtual average rating type", typeof parseFloat((this.totalScore/this.reviewCount).toFixed(1)));

})

restaurantSchema.virtual("dollars").get(function(){
  var numdollars = parseInt(this.price);
  return "$".repeat(numdollars);
})

restaurantSchema.virtual("averageStars").get(function(){
  var avgrating = this.averageRating;
  var stars = avgrating;
  if((avgrating%1) > 0.2 ){
    console.log("rating is decimal");
    stars = Math.trunc(avgrating)+.5;
    console.log("rounded avergae rating to",stars,"from", avgrating);
  }else{
    stars = Math.trunc(avgrating);
  }

  return stars;

})

restaurantSchema.methods.getReviews = function (callback){
  var restid = this._id;
  Review.find({restaurantId: restid}).populate('userId').exec(function(err,reviews){
    callback(err,reviews);
  })
}

userSchema.methods.getReviews = function (callback){
  var userid = this._id;
  Review.find({userId: userid}).populate('restaurantId').exec(function(err,reviews){
    callback(err,reviews);
  })
}

// restaurantSchema.methods.stars = function(callback){
//   var restid = this._id;
//   Review.find({restaurantId: restid}).exec(function(err,reviews){
//     callback(err,reviews);
//   })
//
// }

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
