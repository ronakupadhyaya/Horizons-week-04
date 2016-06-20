// YOUR CODE HERE
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
	user: {
		type: String,
		require: true
	},
	pass: {
		type: String,
		require: true
	}
})

module.exports = mongoose.model('User',User)