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

var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function(){
  var birthYear = this.birthday.getFullYear();
  var todayYear = (new Date()).getFullYear()
  return (todayYear - birthYear)
})

userSchema.method('toggleGender', function(){
  if(this.gender === 'male'){
    return this.gender = 'female'
  } else if(this.gender === 'female'){
    return this.gender = 'male'
  }
})

userSchema.static('getByFirstName', function(name, cb){
  this.find({'name.first': name}, cb)
})

var User = mongoose.model('User', userSchema);

module.exports = User;
