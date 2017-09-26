"use strict";

var mongoose = require('mongoose');

// PART 5.1
var User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
})

module.exports = {
  User,
}
