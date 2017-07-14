// YOUR CODE HERE
"use strict";

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var User = mongoose.model('user', {
  username: String,
  password: String,
});

// var user = mongoose.model('user', {
//   name: String,
//   hashedPassword: String,
// });

module.exports = User;
