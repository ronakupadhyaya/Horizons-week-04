// main server file for table app
// dom chan

var express = require('express')
var app = express()

//if a path is not specified, it applies to every route afterwards. ORDER MATTERS!!!!
app.use('/hello', function(req,res,next){
	console.log("Hello World");
	next();
})

//setups middleware, saves on if statements dependency
app.use('/static', express.static('public')) 

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/table.html');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})