var http = require('http');
var queryString = require('query-string');
var handlebars = require('handlebars');

var request = require('./request');
var response = require('./response');

exports = module.exports = createApplication;

function createApplication () {
  let app = function(req, res, next) {
    app.handle(Object.assign(req, request), Object.assign(res, response), next);
  };

  var routes = []; // array for your routes

  app.handle = function(req, res, next) {
    // req is an http.IncomingMessage, which is a Readable Stream
    // res is an http.ServerResponse, which is a Writable Stream
    for (var i = 0; i < routes.length; i++) {
      let route = {};
      Object.assign(route, routes[i]);
      var locOfQ = req.url.indexOf('?');

      // handle params
      req.params = {};
      if(route.route.indexOf(':') !== -1) {
        route.route = route.route.split('/');
        route.route.forEach((item, i) => {
          if(!item.indexOf(':')) req.params[item.substr(1)] = req.url.split('/')[i];
          route.route[i] = item.replace(/:.*/ig, req.url.split('/')[i]);
        });
        route.route = route.route.join('/');
      }

      if (route.method(req.method) && (locOfQ !== -1 ? req.url.substr(0,locOfQ) : req.url) === route.route) {
        req.query = queryString.parse(req.url.substr(locOfQ));

        if (req.method === "POST") {
          let body = '';
          req.on('readable', function() {
            var chunk = req.read();
            if (chunk) body += chunk;
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
    routes.push({
      method: () => (true),
      route: routePrefix,
      callback: callback
    });
  };

  app.get = function(route, callback) {
    routes.push({
      method: (method) => (method === 'GET'),
      route: route,
      callback: callback
    });
  };

  app.post = function(route, callback) {
    routes.push({
      method: (method) => (method === 'POST'),
      route: route,
      callback: callback
    });
  };

  // create a http server listening on the given port
  app.listen = function(port) {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  };

  return app;
};
