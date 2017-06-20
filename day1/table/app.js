var express = require('express')
var app = express()

app.use(helmet());

//runs every time between middleware. //whenever you call other link.
app.use(function(req, res, next) {
  console.log("1");
  //res.send("Hey from 1")
  next();
})
app.use(function(req, res, next) {
  console.log("2");
  //res.send("Hey from 2")
  next();
})

app.use('/static', express.static('public')) //theme of the entire day

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/table.html")
  //res.sendFile( "/table.html")
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
