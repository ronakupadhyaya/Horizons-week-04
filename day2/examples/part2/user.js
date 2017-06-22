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

userSchema.method('toggleGender', function(){
  if(this.gender === 'female'){
    this.gender = 'male';
  } else {
    this.gender = 'female';
  }
})

userSchema.static('getByFirstName', function(name, callback) {
  this.find({"first.name":name}, function()
})

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  userSchema: userSchema
}
