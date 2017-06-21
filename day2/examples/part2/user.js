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

userSchema.methods.toggleGender = function() {
	if (this.gender === 'male') {
		this.gender = 'female'
	}
	else if (this.gender === 'female') {
		this.gender = 'male'
	}
	else {
		this.gender = 'Non-binary Gender'
	}
}

userSchema.statics.getByFirstName = function(name, callback) {
	this.find({"name.first": name}, function(err, users) {
		callback(err, users)
	});
}

var ageVirtual = userSchema.virtual('age')

function getAge(user) {
  var ageDifMs = Date.now() - user.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

ageVirtual.get(function() {
	return getAge(this)
})

ageVirtual.set(function() {
	this.age = getAge(this)
})

var User = mongoose.model('User', userSchema);

module.exports = User;
