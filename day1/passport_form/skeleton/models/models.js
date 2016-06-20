// YOUR CODE HERE
var mongoose= require('mongoose');
//don't forget to connect to data base!!!
mongoose.connect(require('./connect'));
var Schema=mongoose.Schema;
var UserSchema=new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})

module.exports=mongoose.model('User', UserSchema);