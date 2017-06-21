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

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function getAge(){
  var birth = this.birthday;
  var ageDifMs = Date.now() - birth.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

userSchema.method('toggleGender', function(){
  var gender = this.gender;
  if (gender ==="male"){
    this.gender = "female";
  } else if (gender === "female"){
    this.gender = "male";
  }
});

userSchema.static('findByName', function(firstname, callback){
  this.find({'name.first': firstname}, callback);
});

var User = mongoose.model('User', userSchema);

module.exports = User;
