var http = require('http');
var querystring = require('querystring');

var checkArray = function(routePrefix,route){
  console.log(routePrefix)
  var rPre = routePrefix.split('/');
  var rSpl = route.split('/');
  if(routePrefix === '/') {
    return true;
  } else {
    for(var i=0;i<rPre.length;i++) {
      if(rPre[i] !== rSpl[i]){
        return false;
      }
    }} return true;
  }

  module.exports = function () {
    var routes = [];

    return {
      get: function(route, callback) {
        routes.push({
          route:route,
          callback:callback,
          method:'GET'
        })
      },
      post: function(route, callback) {
        routes.push({
          route:route,
          callback:callback,
          method:'POST'
        })
      },
      use: function(routePrefix, callback) {
        if(typeof routePrefix === 'string'){
          routes.push({
            route: routePrefix,
            callback:callback,
            method:'USE'
          })
        } else{
          routes.push({
            route:'/',
            callback:routePrefix,
            method:'USE'
          })
        }
      },
      listen: function(port) {
        var server = http.createServer(function(req,res){
          res.send = function(data) {
            this.writeHead(200, {'Content-Type': 'text/plain'})
            this.end(data);
          };
          res.json = function(data) {
            this.setHeader('Content-Type', 'application/json')
            this.end(JSON.stringify(data))
          };
          res.render = function(name,options){

          }

          var url = req.url.split('?');
          req.query = querystring.parse(url[1]);
          console.log('my query is', req.query);

          for(var i=0;i<routes.length;i++){
            var route = routes[i];
            if(route.route === url[0] && req.method === route.method){
              if(route.method === 'GET') {
                route.callback(req,res);
                return;
              } else if (route.method === 'POST') {
                var body = '';
                req.on('readable', function() {
                  var chunk = req.read();
                  if (chunk) body += chunk;
                });
                req.on('end', function() {
                  // queryString is the querystring node built-in
                  req.body = querystring.parse(body);
                  route.callback(req,res);
                });
                return;
              }
            }
            else if(checkArray(route.route,url[0]) && route.method === 'USE') {
              route.callback(req,res);
              return;
            }
            //todo if no routes matches display error
          }
        });
        server.listen(port)
      }
    }
  }
