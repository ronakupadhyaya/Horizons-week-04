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

var virtualAge = userSchema.virtual('age');
virtualAge.get(function() {
  return Math.round((new Date().getFullYear()) - (this.birthday).getFullYear());
});
virtualAge.set(function(age) {
  this.birthday.setYear((new Date().getFullYear()) - age);
});

userSchema.methods.toggleGender = function() {
  if (this.gender === 'male') {
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
}

userSchema.statics.findByName = function(name, callback) {
  return this.find({'name.first': name}, callback);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
