var http=require('http');
var querystring=require('querystring')
module.exports=function() {
  var routes=[]
  return {
    post: function(route, callback){
      routes.push({
        method:'POST',
        route:route,
        callback:callback
      })
    },
    get: function(route, callback) {
      routes.push({
        method:'GET',
        route:route,
        callback:callback
      })
    },
    // exercise 3
    //matches any request method
    //will run with any matching route prefix
    //if no path specified run on every request

    use: function(route, callback){
      routes.push({
        method:'USE',
        route:route,
        callback:callback
      })
    },
    listen: function(port) {
      var server =  http.createServer(function(req,res) {
        res.send=function(data) {
          this.writeHead(200, {'Content-type': 'text/plain'});
          this.end(data);
        }
        res.json=function(data){
          this.writeHead(200,{'Content-type': 'application/json'});
          this.end(JSON.stringify(data));
        }
        var url=req.url.split('?');
        req.query=querystring.parse(url[1]);
        for (var i=0;i<routes.length;i++) {
          var route=routes[i];
          var url=req.url.split('?');
          var path = req.url.split('/');
          var runUrl = false
          console.log(i)
          console.log(route.route)
          console.log(url);
          if(typeof route.route === 'Object')
          console.log(route.route.split('/'))
          console.log(path);
          if(route.method==='USE' && (route.route === path[1] || route.route )) runUrl=true;
          //console.log(runUrl);
          if( route.route===url[0]&&route.method===req.method||runUrl) {
            console.log('route' + route.route);

            if(route.method==='GET'||!route.method){
              console.log('get function')
              route.callback(req,res);
              return;
            };
            if(route.method==='POST'||!route.method){
                  console.log('post function')
              var body = '';
              req.on('readable', function() {
                var chunk = req.read();
                if (chunk) body += chunk;
              });
              req.on('end', function() {
                // queryString is the querystring node built-in
                req.body = querystring.parse(body);
                route.callback(req,res);
                return;
              });
            }
          };
        };
      })
      server.listen(port)
    }
    //method
  };
};
