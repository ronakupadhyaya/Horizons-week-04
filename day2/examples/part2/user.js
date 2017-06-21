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

userSchema.virtual('age').get(function(){
  return getAge(this.birthday)
});

userSchema.method('toggleGender', function(){
  this.gender = this.gender==='male' ? 'female' : 'male'
});

userSchema.static('findByName', function(name, callback){
  this.find({"name.first": name}, function(error, users){
    callback(error, users)
  })
})


function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
