//main server file for table app

var express = require("express");
var app = express();
var helmet = require('helmet');

app.use(helmet());

app.use(function(req, res, next) {
  console.log("1");
  // res.send("hey from 1")
  next();
})
app.use(function(req, res, next) {
  console.log("2");
  // res.send("hey from 2")
  next();
})

//file type: static, folder that it applies to: public
//should have static at top of page
app.use('/static', express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/table.html');
});



app.listen(3000, function() {
  console.log("sick server started smoothly");
});
