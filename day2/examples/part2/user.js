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
}, {
  toJSON: {
    virtuals: true
  }
});

var virtualAge = userSchema.virtual('age');

virtualAge.get(function () {
  return getAge(this.birthday);
})

virtualAge.set(function (birthday) {
  this.birthday = birthday;
})

userSchema.methods.toggleGender = function () {
  if (this.gender === "Male")
    this.gender = "Female"
  else
    this.gender = "Male"
}

userSchema.statics.findByName = function (name, callback) {
  this.find({
    'name.first': name
  }, callback)
}

var User = mongoose.model('User', userSchema);

module.exports = User;

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
