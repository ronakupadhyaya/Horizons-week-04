var express = require('express');
var app = express();
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// mongoose.connect(process.env.MONGODB_URI || "mongodb://db-user:8g(T0+w!d6qD=/bLtI@ds139969.mlab.com:39969/snuupy-horizons");

// var Book = mongoose.model('Book', {
// 	title: String,
// });


app.get('/', function(req, res) {
	res.send("hello world");
});

// app.get('/newbook/:title', function(req, res) {
// 	var b = new Book({
// 		title: req.params.title
// 	});

// 	b.save(function(error) {
// 		if (error) {
// 			console.log("Error", error);
// 		} else {
// 			console.log("added to db");
// 		}
// 		console.log("closing connection to db");
// 		mongoose.connection.close();
// 	});

// 	res.json(b);

// });

app.post('/twilio', function(req, res) {
	console.log("Twilio!", req.body);
	res.send('ok');
});

app.listen(process.env.PORT || 3000);