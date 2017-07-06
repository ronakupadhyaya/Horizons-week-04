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
  if (this.gender === 'female') {
    this.gender = 'male';
  } else {
    this.gender = 'female';
  }
}

userSchema.statics.findByName = function(name, cb) {
  this.find({'name.first': name}, function(err, users) {
    cb(err, users);
  });
}

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
  var age = (new Date()).getFullYear() - (new Date(this.birthday)).getFullYear();
  return Math.floor(age);
});

var User = mongoose.model('User', userSchema);


module.exports = User;
