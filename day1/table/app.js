//main server form-inline

var express = require('express');
var app = express();

// var helmet = require('helmet');

// app.use(helmet());

app.use(function(req, res, next) {
  console.log("1");
  // res.send("HEY from 1");
  next();
});

app.use(function(req, res, next) {
  console.log("2");
    // res.send("HEY from 2");
    next();
});

app.use('/assets', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/table.html");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
