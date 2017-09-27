"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
}, {
  toJSON: {
    virtuals: true
  }
});

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
  return getAge(this.birthday);
})

userSchema.methods.toggleGender = function() {
  this.gender === 'male' ? this.gender = 'female' : this.gender = 'male';
}

userSchema.statics.findByName = function(name, callback) {
  this.find({
    "name.first": name
  }, function(error, users) {
    callback(error, users);
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
