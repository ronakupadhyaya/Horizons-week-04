var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = new Schema({
    name : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true 
    }
})

module.exports = mongoose.model('Contact', Contact);