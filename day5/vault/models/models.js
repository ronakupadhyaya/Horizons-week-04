"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);
var User = new mongoose.Schema ({
	username: {
	    type: String,
	    required: true
	 },
	password: {
		type: String,
		required: true
	}
})


module.exports = mongoose.model('User', User);
