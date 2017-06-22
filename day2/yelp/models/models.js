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

userSchema.methods.isFollowing = function(userId, callback){
  Follow.find({from: this._id, to: userId}, function(err, followObj){
    if (err){
      res.status(500).send('error checking if following');
    } else if (!followObj) {
      callback(false);
    } else {
      callback(true);
    }
  })
}

userSchema.methods.getFollows = function (id, callback){
  Follow.find({from: id})
  .populate('to')
  .exec(function(err, allFollowing){
    if (err){
      res.status(500).send('allFollowing error');
    } else{
      Follow.find({to: id})
      .populate('from')
      .exec(function(err, allFollowers){
        if (err){
          res.status(500).send('allFollowers error');
        } else {
          callback(allFollowers, allFollowing);
        }
      })
    }
  })
}

userSchema.methods.toggleFollow = function(idToFollow, callback){
  var id = this._id
  Follow.find({from: id, to: idToFollow}, function(err, followObj){
    if(err) {
      res.json({'error': 'database error in toggle follow'});
    } if (followObj.length > 0) {
      Follow.remove({from: id, to: idToFollow}, function(err, foundFollow){
        if(err){
          res.json({'error': 'failed to unfollow'});
        } else {
          callback();
        }
      })
    } else {
      console.log(id);
      var newFollow = new Follow ({
        from: id,
        to: idToFollow
      });
      newFollow.save(function(err){
        if (err){
          res.json({'error': 'failed to follow'});
        } else {
          callback();
        }
      })
    }
  })
}

// userSchema.methods.follow = function (idToFollow, callback){
//   Follow.find({from: this._id, to: idToFollow}, function(err, followObj){
//     if(err) {
//       res.status(500).send('error in finding follow');
//     } if (followObj) {
//       console.log('follow already exists!');
//       res.send('follow already exists!')
//     } else {
//       var newFollow = new Follow ({
//         from: this._id,
//         to: idToFollow
//       });
//       newFollow.save(function(err, callback){
//         if (err){
//           res.status(500).send('error in finding follow');
//         } else {
//           callback();
//         }
//       })
//     }
//   })
// }
//
// userSchema.methods.unfollow = function (idToUnfollow, callback){
//   Follow.remove({from: this._id, to: idToUnfollow}, function(err, foundFollow){
//     if(err){
//       res.status(500).send('error in unfollowing');
//     } else {
//       callback();
//     }
//   })
// }

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

var reviewSchema = mongoose.Schema({
  content: String,
  stars: Number,
  restaurantId: mongoose.Schema.ObjectId,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longtitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number,
  totalScore: Number,
  reviewCount: Number,
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurantId: restaurantId})
    .populate('userId')
    .exec(function(err, revArr){
      if(err){
        console.log('failed to get reviews');
      } else{
        callback(revArr);
      }
  })
}

userSchema.methods.getReviews = function(callback) {
  Review.find({userId: this._id})
    .populate('restaurantId')
    .find(function(err, revArr){
      if(err){
        res.status(500).send('failed to get reviews');
      } else{
        callback(revArr);
      }
    })
}

var averageRating = restaurantSchema.virtual('averageRating');
averageRating.get(function(){
  return this.totalScore / this.reviewCount;
})

//restaurantSchema.methods.stars = function(callback){
//
//}

var User =mongoose.model('User', userSchema);
var Restaurant =mongoose.model('Restaurant', restaurantSchema);
var Review =mongoose.model('Review', reviewSchema);
var Follow=mongoose.model('Follow', FollowsSchema);


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
