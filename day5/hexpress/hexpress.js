var http = require('http')
var querystring = require('querystring');
var handlebars = require('handlebars');

module.exports = function () {
  var routes = [];

  return {
    get: function(route, callback) {
      routes.push({
        route: route,
        callback: callback,
        method: 'GET'
      })
    },

    post: function(route, callback) {
      routes.push({
        route: route,
        callback: callback,
        method: 'POST'
      })
    },

    use: function(routePrefix, callback) {
      if (typeof routePrefix === 'function') {
        callback = routePrefix;
        routePrefix = '/';
      }
      routes.push({
        route: routePrefix,
        callback: callback,
        method: 'USE'
      })
    },

    listen: function(port) {
      var server = http.createServer(function(req, res) {

        var url = req.url.split('?')
        req.query = querystring.parse(url[1])

        res.send = function(string) {
          res.writeHead(200, {'Content-Type': 'text/plain'})
          res.end(string)
        }

        res.json = function(obj) {
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(JSON.stringify(obj))
        }

        res.render = function(name, options) {
          res.writeHead(200, {'Content-Type': 'text/plain'})
          var template = handlebars.compile(name)
          var result = template(options);
          res.end(result);
        }

        for (var i = 0; i < routes.length; i++) {
          var route = routes[i];
          if (route.route === url[0] && route.method === req.method && route.method === 'GET') {
            console.log('called get')
            route.callback(req, res);
            return;
          }
          if (route.route === url[0] && route.method === req.method && route.method === 'POST') {
            var body = '';
            req.on('readable', function() {
              var chunk = req.read();
              if (chunk) body += chunk;
            });
            req.on('end', function() {
              // queryString is the querystring node built-in
              req.body = querystring.parse(body);
              route.callback(req, res);
            });
            return;
          }
          if (url[0].startsWith(route.route) && route.method === 'USE') {
            console.log('called use')
            route.callback(req, res);
            return;
          }
        }

      })
      server.listen(port)
    }
  };
};
