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

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
	return getAge(this.birthday)
})

userSchema.methods.toggleGender = function() {
	this.gender = this.gender === 'male' ? 'female' : 'male';
}

userSchema.statics.getByFirstName = function(fname, callback) {
	this.find({'name.first': fname}, callback)
}

var User = mongoose.model('User', userSchema);

module.exports = User;
