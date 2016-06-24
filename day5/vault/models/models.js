"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect').db;
mongoose.connect(connect);

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	}
});

var models = {
	User: mongoose.model('User2', UserSchema)
}

module.exports = models;