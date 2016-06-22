var mongoose = require('mongoose');

// define the schema for contact model
var contactSchema = mongoose.Schema({
		ownerId        : String,
		name         : String,
        email        : String,
        phone        : String,
        messages     : []
});

// create the model for contact and expose
module.exports = mongoose.model('Contact', contactSchema);