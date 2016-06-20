var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//this is more middleware
var routes = require('./routes/index');

//this is the entry point of the application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//all of these have next in it, so they pass down to each line of code
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// this loads the routes file
// if the page is found in the routes document, it goes to it, then terminates it. Doesn't call next.
//if the page isn't found, it goes to the next line of code, the 404 function
app.use('/', routes);

// catch 404 and forward to error handler
//404 means not found, this is a catch-all
//router.get = retrieves the route /
//app.use does all (get, post, etc)
//this function calls everything (everything goes through this function)
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);//how that middleware tells them how to move on to the next layer, the next middleware (without it it'll stop)
  //res.render('index', {title:ERROR});
});

// error handlers (has 4 variables)

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
