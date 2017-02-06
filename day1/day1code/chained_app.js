var express = require('express');
var app = express();

var port = 3000;



app.use('/', function (req, res, next) {
	req.funstuff = {from2: 'hi ppo'};
	console.log('hi from middleware 2');
	next();
});
app.use('/', function (req, res, next) {
	console.log('hi from middleware 1');
	console.log('1', req.funstuff);
	next();
});

app.use('/api', function (req, res, next) {

	console.log('hi from middleware 3');
	console.log('3', req.funstuff);
	next();
});

app.get('/', function(req, res) {
	res.send('<h1>root route</h1>');
});


app.get('/api', function(req, res) {
	res.json({ firstname: 'John', lastname: 'Doe' });
});




app.listen(port);
console.log('running on port: %d', port);
