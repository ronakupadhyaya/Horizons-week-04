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
  if(this.gender === "male"){
    this.gender = "female";
    return this.gender;
  }
  else if (this.gender === "female"){
    this.gender = "male";
    return this.gender;
  }
}

userSchema.statics.findByName = function (name, callback){
  this.find({"name.first": name}, callback);
}


var ageVirtual = userSchema.virtual('age')
ageVirtual.get(function getAge(birthday){
  // console.log(  this.birthday);
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  var age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age;
})
ageVirtual.set(function (age){
  this.age = age;
})

var User = mongoose.model('User', userSchema);

module.exports = User;
