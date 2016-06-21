// YOUR CODE HERE
"use strict";
var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);
var Schema = mongoose.Schema;
var UserSchema = new Schema({
		username:{
			type: String,
			required: true
		},
		password:{
			type: String,
			required: true
		}
});

module.exports = mongoose.model('User', UserSchema);
