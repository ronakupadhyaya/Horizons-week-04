// YOUR CODE HERE
var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);

var User = mongoose.model('User', {
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})

module.exports = User;