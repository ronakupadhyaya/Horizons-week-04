var mongoose = require('mongoose');

// define the schema for message model
var messageSchema = mongoose.Schema({
		direction : String,
		type      : String,
		createdAt : { type: Date, default: Date.now },
		text      : String
});

// create the model for message and expose
module.exports = mongoose.model('message', messageSchema);