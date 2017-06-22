var express  = require('express');
var app = express();


// app.get('/', function(req, res, next) {
//   next(new Error('Something went wrong'));
// });

app.get('/', function(req, res) {
  res.send('A');
});

app.use(function(err, req, res, next) {
  res.send('B');
});


app.listen(3000,function(){
  console.log("listening on port:3000!")
})
