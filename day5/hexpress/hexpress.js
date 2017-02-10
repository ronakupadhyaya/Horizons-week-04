var http = require('http');
var querystring = require('querystring');

module.exports = function () {
  var routes = [];

  return {
    get: function(route, callback) {
      routes.push({
        route: route,
        callback: callback
      });
    },
    listen: function(port) {
      var server = http.createServer(function(req, res) {
        res.send = function(data) {
          this.writeHead(200, { 'Content-Type': 'text/plain'});
          this.end(data);
        };
        var url = req.url.split('?');
        req.query = querystring.parse(url[1]);
        console.log('my query is', req.query);

        for (var i = 0; i < routes.length; i++) {
          var route = routes[i];
          if (route.route === url[0] && req.method === 'GET') {
            route.callback(req, res);
            return;
          }
        }
        // TODO If no route matches display error!
      });
      server.listen(port);
    }
    // YOUR METHODS HERE
  };
};
