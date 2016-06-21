// YOUR CODE HERE
var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);

module.exports = {
	users: mongoose.model('User', {
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	})
}