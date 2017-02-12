var http = require('http');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var fs = require('fs');
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
        }; {
          res.render = function(name, options) {
            this.writeHead(200, {'Content-Type': 'text/html'});
            var source = fs.readFileSync(name) + '';
            var newSource = handlebars.compile(source);
            var result = newSource(options);
            this.end(result);
            // USE FS, AND REPLACE FUNCTION using THIS.END
          }
        }
        var url = req.url.split('?');
        req.query = queryString.parse(url[1]);

        var secUrl = req.url.split('/');
        console.log('SECURL')
        console.log(secUrl);
        // for(var i = 0; i < secUrl.length; i++) {
        //   if(secUrl[i])
        // }
        req.params = {
          fname: secUrl[1],
          lname: secUrl[3]
        }


        // req and res are built into HTML
        // rules of the game: first matching route gets the callback
        for(var i = 0; i < routes.length; i++) {
          var route = routes[i];
          // var url = req.url.split('/');
          var currentRoute = route.route;
          // check if we actually have a route. if we do, make it end in a slash (for consistency)
          if(currentRoute) {
            if(!(currentRoute.endsWith('/'))) {
              currentRoute = currentRoute + "/";
              console.log(currentRoute);
            }
            if(!(url[0].endsWith('/'))) {
              url[0] = url[0] + "/";
              console.log(url[0]);
            }
          }

          // PART FOR PARAMS


          if(currentRoute === url[0] && req.method === 'GET' && route.method === 'GET') {
            console.log('here')
            console.log(currentRoute)
            console.log(url[0])
            route.callback(req, res);
            return;
          } else if (currentRoute === url[0] && req.method === 'POST' && route.method === 'POST'){
            console.log('here1')
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

            //!(url[0].indexOf(currentRoute))
          } else if(url[0].startsWith(currentRoute) && route.method === 'USE' && req.method ==='GET'){
            console.log('here2')
            route.callback(req, res);
            return;

            // !(url[0].indexOf(currentRoute))
          } else if(url[0].startsWith(currentRoute) && route.method === 'USE' && req.method ==='POST'){
            console.log('here3')
            console.log(url[0]);
            console.log(currentRoute)
            route.callback(req, res);
            return;
          } else {
            console.log('none');
            throw 'error: no matches'
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
      // sometimes, callback will be seen as routePrefix
      if(typeof routePrefix === "string") {
        routes.push({
          route: routePrefix,
          callback: callback,
          method: 'USE'
        })
      } else {
        routes.push({
          route: '/',
          callback: routePrefix,
          method: 'USE'
        })
      }
    }
  }
}
