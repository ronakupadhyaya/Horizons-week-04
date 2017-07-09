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

var virtualUser = userSchema.virtual('age')

virtualUser.get(function(){
    return new Date().getFullYear() - new Date(this.birthday).getFullYear()
})

// METHOD VERSION 1
// userSchema.methods.toggleGender = function(){
//     if (this.gender === 'female'){
//         this.gender = 'male'
//         return this.gender
//     }
//     else if (this.gender === 'male'){
//         this.gender = 'female'
//         return this.gender
//     }
// }

// METHOD VERSION 2
userSchema.method('toggleGender', function(){
    if (this.gender === 'female'){
        this.gender = 'male'
        return this.gender
    }
    else if (this.gender === 'male'){
        this.gender = 'female'
        return this.gender
    }
})

// STATICS VERSION 1
// userSchema.statics.findByName = function(name, callback) {
//     this.find({'name.first': name}, callback);
// }

// STATICS VERSION 2
userSchema.static('findByName', function(name, callback) {
    this.find({'name.first': name}, callback);
})


var User = mongoose.model('User', userSchema);

module.exports = User;
