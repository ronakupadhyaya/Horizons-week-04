var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: {
    type: String,
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
  location: {
    type: String
  }
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({from: id})
    .populate('to')
    .exec(function(err, allFollowing) {
      if (err) {
       console.log('Database Error: getFollows, find, allFollowing');
      } else {
        Follow.find({to: id})
          .populate('from')
          .exec(function(err, allFollowers) {
            if (err) {
              console.log('Database Error: getFollows, find, allFollowers');
            } else {
              callback(allFollowers, allFollowing);
            }
          });
        }
    })
}

userSchema.methods.toggleFollow = function (idToFollow, callback){
  var id = this.id;
  Follow.find({from: id, to: idToFollow}, function(err, foundFollow) {
    if (err) {
      res.json({error: 'Database Error: Finding Follow for Save'});
    } else {
      if (foundFollow.length < 1) {
        var newFollow = new Follow({
          from: id,
          to: idToFollow
        });
        newFollow.save(function(err) {
          if (err) {
            res.json({error: 'Database Error: Saving Follow'});
          } else {
            callback();
          }
        });
      } else {
        Follow.remove({from: id, to: idToFollow}, function(err, foundFollow) {
          if (err) {
            res.json({error: 'Database Error: Removing Follow'});
          } else {
            callback();
          }
        });
      }
    }
  });
}

userSchema.methods.isFollowing = function(id, callback) {
  Follow.find({from: this._id, to: id}, function(err, foundFollow) {
    if (err) {
      res.status(500).send('Database Error: isFollowing, find, foundFollow');
    } else {
      foundFollow = foundFollow && true
      foundFollow = foundFollow || false
      callback(foundFollow);
    }
  });

}

var FollowsSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});


var restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: String,
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: Number,
  openTime: Number,
  closingTime: Number,
  totalScore: Number,
  reviewCount: Number
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurantId: restaurantId})
    .populate('userId')
    .exec(function(err, rest) {
    if (err) {
      console.log('Database Error: restaurantSchema, getReviews', err)
    } else {
      callback(rest);
    }
  });
}

userSchema.methods.getReviews = function(callback) {
  Review.find({userId: this.id})
    .populate('userId')
    .exec(function(err, user) {
      if (err) {
        console.log('Database Error: reviewSchema, getReviews');
      } else {
        callback(user);
      }
  });
}

var averageRating = restaurantSchema.virtual('averageRating');
averageRating.get(function() {
  return this.totalScore / this.reviewCount;
});
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
