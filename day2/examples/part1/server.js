"use strict";

var express = require('express');

// Express setup
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var hbs = require('./helpers');

app.engine('.hbs', exphbs(hbs));
app.set('view engine', '.hbs');

// mongoose setup
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDb!');
})
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});
// mongoose.connection.close();
// mongoose.connect(process.env.MONGODB_URI);
var User = require('./user');

// routes
app.get('/', function(req, res) {
  var pageNumber = getPageNumber(Number(req.query.page));
  var prev = (pageNumber <= 1 ? 1 : pageNumber - 1);
  var next = pageNumber + 1;
  var limit = Number(req.query.limit) || 10;

  //-------------------EDIT ONLY BELOW THIS LINE!----------------------//

  User.find(function(err,users){
    res.render('index', {
      listItems: users,
      prev: prev,
      current: pageNumber,
      next: next,
      limit: limit
    });
  });

  //-------------------EDIT ONLY ABOVE THIS LINE!----------------------//

});



//-------------------DON'T EDIT BELOW THIS LINE!----------------------//

//helper function to avoid users inputting negative values or 0 for page number
var getPageNumber = function (attempt) {
  if (!attempt || attempt <= 1) {
    return 1;
  } else {
    return attempt;
  }
};

var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('listening on port ' + port);
});
