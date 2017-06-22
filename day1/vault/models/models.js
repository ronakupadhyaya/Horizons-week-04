"use strict";

var mongoose = require('mongoose');

var User = mongoose.model('User', {
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: false
	}

});

module.exports = {
  User: user
}