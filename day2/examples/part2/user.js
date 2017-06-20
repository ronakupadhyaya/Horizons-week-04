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

// Using virtuals to put user ages into database

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var virtualAge = userSchema.virtual('age');

virtualAge.get(function(){
  return getAge(this.birthday);
})
// end of virtuals section

// Method to toggle gender
userSchema.methods.toggleGender = function(){
  if(this.gender === 'male'){
    console.log('m')
    this.gender = 'female';
  }
  else{
    console.log('f')
    this.gender = 'male';
  }
}
//

//static Schema
userSchema.statics.getByFirstName = function(firstname, callback){
  this.find({"name.first": firstname}, callback)
}
// virtualAge.set(function(name){
//
// })
var User = mongoose.model('User', userSchema);

module.exports = User;
