



var models = require('./models/models');
var User = models.User;
var Follow = models.Follow;

User.findById('5949950cf297b548850a930e', function(err, austin) {
  austin.getFollows(function(followers, following) {
    console.log("followers: ", followers);
             console.log("following: ", following);
  })
})
//
// User.remove({}, function(err) {
//   Follow.remove({}, function(err) {
//
//
//
//     var austin = new User({
//       name: 'Austin',
//       email: 'austin@austin.com',
//       password: '1234',
//       location: 'SF'
//     });
//
//     var andrew = new User({
//       name: "Andrew",
//       email: "andrew@andrew.com",
//       password: "1234",
//       location: "Boston"
//     });
//
//     austin.save(function(err, obj) {
//       console.log(err, obj);
//
//       andrew.save(function(err, obj2) {
//         console.log(err, obj2);
//
//         austin.getFollows(function(followers, following) {
//           console.log("followers: ", followers);
//           console.log("following: ", following);
//
//
//           austin.follow(obj2._id, function(success) {
//             console.log("austin managed to follow andrew? ", success);
//
//             andrew.follow(obj._id, function(s) {
//               console.log("andrew managed to follow austin? ", s);
//
//               austin.getFollows(function(followers, following) {
//                 console.log("followers: ", followers);
//                 console.log("following: ", following);
//               });
//
//             })
//           })
//
//         })
//
//
//
//       })
//
//
//
//     })
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//   })
// })
