var express = require('express');
var app = express();
var helmet = require('helmet');

app.use(helmet())

// same thing as app.use('/', helmet());
// from the documentation
var port = 3000;

app.use('/assets', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet /></head><body><h1>Hello world!</h1></body></html>');
});

app.get('/person/:id', function(req, res) {
	console.log(req.params.id);
	res.send('<html><head></head><body><h1>Person: ' + req.params.id + '</h1></body></html>');
});

app.get('/profile_pic', function(req, res){
	res.send('<img src=assets/troll_face.png>');
})
// inline exercise (move the dependencies in the head of table.html to be served from /public)
app.get('/table', function(req, res) {
	res.sendFile(__dirname +'/table.html');
})

app.listen(port);
