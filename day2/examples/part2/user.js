"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() -1970);
}

var userSchemaOptions = {
  toJSON: {
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
},{
  toJSON:{
    virtuals:true
  }
},userSchemaOptions);

userSchema.methods.toggleGender = function(){
  this.gender=  this.gender === 'female'? 'male':'female';
}

userSchema.static('findByName', function(fname,callback){
  this.find({'name.first':fname},callback);
});

var dobVirtual = userSchema.virtual('age');

dobVirtual.get(function(){
  return getAge(this.birthday);
})

var User = mongoose.model('User', userSchema);

module.exports = User;
