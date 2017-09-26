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

userSchema.method('toggleGender', function() {
  if(this.gender === 'male') {
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
});

userSchema.static('findByName', function(name, callback) {
  // this being the User model
  this.find({"name.first": name}, callback);
});


var userAgeVirtual = userSchema.virtual('age');

userAgeVirtual.get(function() {
  var ageMsec = Date.now() - this.birthday.getTime();
  var age = parseInt(ageMsec/(1000*60*60*24*365.25));
  return age;
});

userAgeVirtual.set(function(age) {
  this.age = age;
})

var User = mongoose.model('User', userSchema);

module.exports = User;
