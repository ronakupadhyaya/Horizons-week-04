"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {
  toJSON:{
    virtuals:true
  }
}
var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
}, userSchemaOptions

);
userSchema.methods.toggleGender = function(){
  if(this.gender ==='male'){
    this.gender = 'female';
  } else{
    this.gender = 'male';
  }

  return this.gender;
}

userSchema.statics.findByName = function(name, callback){
  this.find({'name.first': name}, callback);
}
var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function(){
  return getAge(this.birthday);
});

ageVirtual.set(function(birthday){
   this.birthday = birthday;
})

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
