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

userSchema.methods.toggleGender = function (){
  if(this.gender === 'male'){
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
};

userSchema.statics.getByFirstName = function(firstName, callback) {
  this.find({'name.first':firstName}, callback);
}

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function(){
  var birthday = this.birthday;
  function getAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  return getAge(birthday);
});

ageVirtual.set(function(age){
  this.birthday = age;
})

var User = mongoose.model('User', userSchema);

module.exports = User;
