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
  var msYear = 365*60*60*24*1000;
  var today = new Date();
  return Math.floor((today - this.birthday) / msYear);
});

userSchema.methods.toggleGender = function(){
  if(this.gender === 'male'){
    this.gender = 'female';
  }
  else if(this.gender === 'female'){
    this.gender = 'male';
  }
};

userSchema.statics.findByName = function(name, callback){
  this.find({'name.first':name},callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
