var express = require('express');
var app = express();
var helmet = require('helmet');
//helmet adds or removes headers

var port = 3000;

app.use('/assets', express.static(__dirname + '/public'));
// declared "/assets" to mean static resources in our public folder

// if someone looks for a /assets anything, it's going to __dirname. and Public files (not here, but the css files there turn background red, etc.) When you load the localhost, and click Network, you see that localhost and style.css were called
// when someone visits, you just send them what they need

// you're just telling it where to find static resources-- /assets

// when people visit the site, they hit "assets" and realize that they need more code-- can request back to the server for more information; we have it stored locally

//API is just how you deal with a response-- middleware sits between request and response. Middleware might check that you have a token, for example, before it lets you login

app.get('/', function(req, res) {
	res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet /></head><body><h1>Hello world!</h1></body></html>');
  //looking for /assets/style.css -- look to line 6 (intercepts it)
});

app.get('/person/:id', function(req, res) {
	console.log(req.params.id);
	res.send('<html><head></head><body><h1>Person: ' + req.params.id + '</h1></body></html>');
});

app.get('/profile_pic', function(req, res){
	res.send('<img src=assets/troll_face.png>');
  // that's a local file! In the public folder
})
// inline exercise (move the dependencies in the head of table.html to be served from /public)
app.get('/table', function(req, res) {
	res.sendFile(__dirname +'/table.html');
})

app.listen(port);
