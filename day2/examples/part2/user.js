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

ageVirtual.get(function(){
  var AgeDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(AgeDifMs);
  return Math.abs(ageDate.getUTCFullYear()-1970);
})

userSchema.method('toggleGender',function(){
  if(this.gender === "male"){
    this.gender = 'female';
  }
  else if(this.gender=== 'female'){
    this.gender = 'male';
  }
})

userSchema.static('findByName',function(name, callback){
  this.find({'name.first':name},callback);
})


var User = mongoose.model('User', userSchema);

module.exports = User;
