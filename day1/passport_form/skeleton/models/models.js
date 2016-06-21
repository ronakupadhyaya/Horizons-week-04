// YOUR CODE HERE
var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);

var User = {
  username: {
    type: String,
  },
  password: {
    type: String,
  },
};

module.exports = {
  User: mongoose.model('User', User),
}
