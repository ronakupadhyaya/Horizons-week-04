"use strict";

var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: {
    type: String
  },
  hashedPassword: {
    type: String
  }
})

module.exports = {
  User: User
}
