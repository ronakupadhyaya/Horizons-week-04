var http = require('http');
var fs = require('fs');
var queryString = require('query-string');

var request = require('./request');
var response = require('./response');

exports = module.exports = createApplication;
// var data = "";
// req.on('data', function(chunk){ data += chunk});
// req.on('end', function(){
//   req.rawBody = data;
//   req.jsonBody = JSON.parse(data);
// });

function createApplication () {
  var app = function(req, res, next) {
    app.handle(Object.assign(req, request), Object.assign(res, response), next);
  };

  var routes = []; // array for your routes

  app.handle = function(req, res, next) {
    // req is an http.IncomingMessage, which is a Readable Stream
    // res is an http.ServerResponse, which is a Writable Stream
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      var locOfQ = req.url.indexOf('?');
      if (route.method(req.method) && (locOfQ !== -1 ? req.url.substr(0,locOfQ) : req.url) === route.route) {
        req.query = queryString.parse(req.url.substr(locOfQ));

        if (req.method === "POST") {
          var body = '';
          req.on('readable', function() {
            body += req.read();
          });
          req.on('end', function() {
            req.body = queryString.parse(body);
            route.callback(req, res);
          });
        } else {
          route.callback(req, res);
        }
      }
    }
  };

  app.use = function(routePrefix, callback) {
    // TODO
    routes.push({
      method: () => (true),
      route: route,
      callback: callback
    });
  };

  app.get = function(route, callback) {
    if (!routes.find((item) => (item.route === route && item.method === 'GET'))) {
      routes.push({
        method: (method) => (method === 'GET'),
        route: route,
        callback: callback
      });
    }
  };

  app.post = function(route, callback) {
    if (!routes.find((item) => {return (item.route === route && item.method === 'POST');})) {
      routes.push({
        method: (method) => (method === 'POST'),
        route: route,
        callback: callback
      });
    }
  };

  // create a http server listening on the given port
  app.listen = function(port) {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  };

  return app;
};
app = createApplication();
app()
app.get()
