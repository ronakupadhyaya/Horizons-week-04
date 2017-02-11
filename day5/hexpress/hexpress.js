var http = require('http');
var queryString = require('querystring');
var bodyParser = require('body-parser');

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
    listen: function(port) {
      var server = http.createServer(function(req, res) {
        res.send = function(data) {
          this.writeHead(200, {'Content-Type': 'text/plain'});
          this.end(data);
        }; {
          res.json = function(data) {
            // data = req.query
            this.setHeader('Content-Type', 'application/json')
            // req.body = bodyParser.json(data);
            // this.write('hello')
            this.end(JSON.stringify(data))
          }
        }
        // var url = req.url.split('?');
        // req.query = queryString.parse(url[1]);

        // req and res are built into HTML
        // rules of the game: first matching route gets the callback
        for(var i = 0; i < routes.length; i++) {
          var route = routes[i];
          var url = req.url.split('/');
          console.log(route.route)
          console.log(url)
          if((route.route + "/") === url[0] && req.method === 'GET' && route.method === 'GET') {
            route.callback(req, res);
            return;
          } else if ((route.route + "/") === url[0] && req.method === 'POST' && route.method === 'POST'){
            var body = '';
            req.on('readable', function() {
              var chunk = req.read();
              if (chunk) body += chunk;
            });
            req.on('end', function() {
              // queryString is the querystring node built-in
              req.body = queryString.parse(body);
              route.callback(req, res);
            });
            return; // why does this have to be outside?
          } else if((route.route + "/") === url[0] && route.method === 'USE' && req.method ==='GET'){
            url = req.url.split('/');
            console.log(url)
            route.callback(req, res);
            return;
          } else if((route.route + "/") === url[0] && route.method === 'USE' && req.method ==='POST'){
            url = req.url.split('/');
            route.callback(req, res);
            return;
          } else {
            console.log('none')
            // need an else for when there are no route arguments
          }
        }
        // TODO: If no route matches, display error
      })
      server.listen(port)
    },
    // YOUR METHODS HERE
    post: function(route, callback) {
      // difference between get and post: posts have req.body
      routes.push({
        route: route,
        callback: callback,
        method: 'POST'
      })
    },
    use: function(routePrefix, callback) {
      routes.push({
        route: routePrefix,
        callback: callback,
        method: 'USE'
      })
    }
  }
}
