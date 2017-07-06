var express = require('express');
var app = express();

app.use(express.static('assets'));

/*app.use('/', function(req, res, next) {//route considered matched to any route starting with /
  console.log("middleware!");
//  res.send('middleware!') not good, sends two responses eventually (error)
  //req.body = --> bodyParser is a middleware.
  req.example = 'hey!';
  next();//request keeps going down
});

app.use('/', function(req, res, next) {
  console.log(req.example);
  next();
});


app.get('/hello', function(req, res) {
  res.send('Hello world!');
});
*/
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
