// YOUR CODE HERE
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = new Schema ({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});