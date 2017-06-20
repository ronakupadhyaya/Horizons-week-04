var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {    //hashed password used for authentication
    type: String,
    required: true
  },
  displayName: String,
  location: String
});

// userSchema.statics.findById= function(id, cb){
//   this.find({"id": id}, cb)
// }

userSchema.methods.getFollows = function (id, cb){
  //the user is the 'from' end
  Follow.find({from: id}).populate('to').exec(function(err, following){
    if(err){res.send('Error find follows', err)}
    else{
      //the user is the 'to' end
      Follow.find({to: id}).populate('from').exec(function(err, followers){
        if(err){res.send('Error find follows', err)}
        else{
          console.log('id', id, 'Followers: ', followers, 'Following: ', following);
          cb(followers, following);
        }
      })
    }
  })
}

userSchema.methods.follow = function (fromId, toId, callback){
  Follow.find({from: fromId, to: toId}, function(err, follows){
    if(err) {console.log("Error finding follows", err)}
    else{
      if(!follows){
        var newFollow = new Follow ({
          from: fromId,
          to: toId
        })
        newFollow.save(callback)
      }
    }
  })
}

userSchema.methods.unfollow = function (fromId, toId, cb){
  Follow.remove({from: fromId, to: toId}, function(err){
    if(err) {res.send('Error when unfollowing', err)}
  })
}

userSchema.methods.isFollowing = function (toId, cb){
  Follow.findOne({from: this._id, to:toId}, function(err, follow){
    if(!err && follow) {cb}
  })
}

userSchema.methods.getReviews = function (user, callback){

}

var followsSchema = mongoose.Schema({
  from: {    //the ID of the User following another
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {    ////the ID of the User being followed
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({
  stars: Number,
  content: String,
  restaurant: {    //the ID of the Restaurant that was reviewed
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name: String,    //The name of the Restaurant
  price: Number,    //A Number on a scale of 1-3 (which you could represent on the page as "$", "$$", "$$$" or "Cheap", "Fair", "Expensive"
  category: String,     //may be an enum if you want to limit its possible options) that describes the type of restaurant represented, i.e. "Korean" or "Barbeque."
  latitude: Number,
  longitude: Number,
  openTime: Number,    //A Number from 0-23 representing the hour the restaurant opens (assume Eastern Time)
  closingTime: Number,
  totalScore: Number,    //A Number that represents the sum of stars from Reviews that have been posted for the Restaurant
  reviewCount: Number    //A Number that represents the number of Reviews that have been posted for the Restaurant
});

var averageRatingVirtual = restaurantSchema.virtual('averageRating');
averageRatingVirtual.get(function(){
  return parseFloat(totalScore / reviewCount).toFixed(1);
})

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


var User = mongoose.model('User', userSchema)
var Restaurant = mongoose.model('Restaurant', restaurantSchema)
var Review = mongoose.model('Review', reviewSchema)
var Follow = mongoose.model('Follow', followsSchema)
module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
