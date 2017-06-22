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
}

var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function(){
  return getAge(this.birthday)
})

userSchema.method.toggleGender= function(){
  if(this.gender === 'male'){
    this.gender === 'female';
  } else {
    this.gender === 'male';
  }
}

userSchema.static.getByFirstName = function (name, callback) {
  this.find({'first.name': name}, callback(error, users))
}

var User = mongoose.model('User', userSchema);

module.exports = User;
