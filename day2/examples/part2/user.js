"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
},{
  toJSON:{
    virtuals:true
  }
});

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
	var bday = new Date(this.birthday);
	var currday = new Date();
	return currday.getYear() - bday.getYear();
})

userSchema.method('toggleGender',function() {
	if (this.gender === 'female')
		this.gender = 'male'
	else 
		this.gender = 'female'
})

userSchema.static('findByName', function(name, callback) {
	this.find({'name.first' : name}, callback);
})

var User = mongoose.model('User', userSchema);

module.exports = User;
