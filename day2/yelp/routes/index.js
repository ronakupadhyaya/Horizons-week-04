var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurants/new', function (req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/profile', function (req, res) {
  req.user.getFollows(req.user._id, function (allFollowers, allFollowing) {
    res.render('singleProfile', {
      user: req.user,
      following: allFollowing,
      followers: allFollowers
    });
  });
});


router.get('/profile/:id', function (req, res) {
  var id = req.params.id;
  req.user.getFollows(id, function (allFollowers, allFollowing) {
    User.findById(id).exec(function (err, user1) {
      req.user.isFollowing(id, function (bool) {
        req.user.getReviews(id, function (reviews) {
          console.log(reviews);
          res.render('singleProfile', {
            user: user1,
            following: allFollowing,
            followers: allFollowers,
            isFollowing: bool,
            id: id,
            reviews: reviews
          });
        });
      })
    });
  });
});

//represnt directories of people
router.use('/dir', function (req, res) {
  User.find().exec(function (err, usersq) {
    res.render('profiles', {
      users: usersq
    });
  })
});


router.post('/unfollow/:id', function (req, res) {

  var unfollowId = req.params.id;
  // User.findById('594978ea8220ad106c27872a').exec(function (err, user) {
  ///  console.log(user);

  req.user.unfollow(unfollowId, function (err) {
    console.log("removed");
  });
  res.redirect("/profile/" + unfollowId);

  // });
});

router.use('/follow/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  req.user.follow(id, function (err) {
    res.redirect('/profile/' + id);
  });
});

router.get('/newrestaurant', function (req, res) {
  res.render("newRestaurant");
});

router.post('/newrestaurant', function (req, res) {

  console.log(req.body);
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.categoty,
    price: req.body.price,
    address: req.body.address,
    openTime: req.body.start,
    closeTime: req.body.end
  });
  restaurant.save(function (err) {
    if (err) {
      console.log("there is error", err);
    }
  });
});

router.get('/singleRestaurant/:id', function (req, res) {
  var id = req.params.id;
  Restaurant.findById(id, function (err, restaurant) {
    restaurant.getReviews(id, function (reviews) {
      res.render("singleRestaurant", {
        restaurant: restaurant,
        reviews: reviews
      });
    })
  })
})



router.get('/allRestaurant', function (req, res) {
  Restaurant.find().exec(function (err, restaurants) {
    console.log(restaurants);
    res.render("restaurants", {
      restaurants: restaurants,
    });
  })
});


router.get('/restaurants/:id/review', function (req, res) {
  res.render("newReview");
});

router.post('/restaurants/:id/review', function (req, res) {

  console.log(req.body);
  var review = new Review({
    contents: req.body.contents,
    stars: req.body.stars,
    restaurantId: req.params.id,
    userId: req.user._id
  });

  review.save(function (err) {
    if (err) {
      console.log("there is error", err);
    }
    res.redirect("/profile");
  });
});









/*********************TESTS****************************/
//test new Restaurant
router.use('/res', function (req, res) {
  res.render("newRestaurant");
});
router.use('/resone', function (req, res) {
  Restaurant.find().exec(function (err, restaurants) {
    console.log(restaurants);
    res.render("singleRestaurant");
  })
});

router.use('/resfull', function (req, res) {
  Restaurant.find().exec(function (err, restaurants) {
    console.log(restaurants);
    res.render("restaurants", {
      restaurants: restaurants
    });
  })
});



///test single profile
router.use('/tsp', function (req, res) {
  req.user.getFollows(req.user._id, function (allFollowers, allFollowing) {
    res.render('singleProfile', {
      user: req.user,
      following: allFollowing,
      followers: allFollowers
    });
  });
});

router.use('/dir', function (req, res) {
  User.find().exec(function (err, usersq) {
    res.render('profiles', {
      users: usersq
    });
  })
});


router.use('/test', function (req, res) {
  User.findById('594978ea8220ad106c27872a').exec(function (err, user) {
    ///  console.log(user);

    req.user.unfollow('59497dad55375000d4d757a1', function (err) {
      console.log("remove");
    })

  });
});

router.use('/testf', function (req, res) {
  User.findById('594978ea8220ad106c27872a').exec(function (err, user) {
    ///  console.log(user);

    req.user.follow('59499c2ded1e7c3b18ee36ea', function (err) {
      console.log("followed");
    });

  });
});

router.use('/tisf', function (req, res) {
  // User.findById('594978ea8220ad106c27872a').exec(function (err, user) {
  //   ///  console.log(user);

  req.user.isFollowing('59497dad55375000d4d757a1', function (bool) {
    console.log(bool);
  });

});


router.use('/testarr', function (req, res) {
  //User.findById('594978ea8220ad106c27872a').exec(function (err, user) {
  ///  console.log(user);

  req.user.getFollows(req.user._id, function (allFollowers, allFollowing) {
    console.log("arr1", allFollowers, "arr2", allFollowing);
  });

});

/***********************************************************/


module.exports = router;
