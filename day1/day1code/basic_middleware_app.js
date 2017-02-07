var express = require('express');
var app = express();

var port = 3000;

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

app.get('/person/:id', function(req, res) {
	res.send('<html><head></head><body><h1>Person: ' + req.params.id + '</h1></body></html>');
});

app.get('/api', function(req, res) {
	res.json({ firstname: 'John', lastname: 'Doe' });
});

app.listen(port);
console.log('running on port: %d', port);