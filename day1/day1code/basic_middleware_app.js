var express = require('express');
var app = express();

var port = 3000;

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
	//request comes in-- before it hits the below code, it goes through the middleware which logs the request url, and then calls next() which passes it on.
	// This middleware lets you log every user! Keep track
	
});

app.get('/person/:id', function(req, res) {
	res.send('<html><head></head><body><h1>Person: ' + req.params.id + '</h1></body></html>');
});

app.get('/api', function(req, res) {
	res.json({ firstname: 'John', lastname: 'Doe' });
	// require json in html and use handlebars
});

app.listen(port);
console.log('running on port: %d', port);
