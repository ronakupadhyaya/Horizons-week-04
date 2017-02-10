# Outline

1. Exercise 1: `hexpress` returns an `app` object with the following methods
  1. `.listen(port)`: start the server by listening on `port`
  1. `.get(route, callback)`: add a `get` route
  1. `callback has two parameters,`req` and `res`
    1. `req.query` contains object of parsed query parameters. Use
      [query-string NPM package](https://www.npmjs.com/package/query-string)
      to do parsing.
    1. `res.send()`: send content type text
    1. `res.json()`: `JSON.stringify()` then send
1. Exercise 2: Implement `.post(route, callback)`
  1. Add support for `req.body`
    - Like `req.query` but only available for posts. Use
      [query-string NPM package](https://www.npmjs.com/package/query-string) to do parsing.
1. Exercise 3: Implement `.use(routePrefix, callback)`
1. Exercise 4: `res.render()`
1. Exercise 5: Implement `req.params`
1. Bonus Exercise 6: Express with `next()`
  1. Callback has third parameter `next` function
1. Double bonus Exercise 7: `res.render()` with layouts

## [`http`](https://nodejs.org/api/http.html)

The primary purpose of Express is to listen for and respond to incoming HTTP
requests. We're going to use the Node built-in library `http` to assist
us in this task.

The `http` library can be accessed via, `require('http')`. You do **not** need
to `npm install` it.

Here are the parts of the `http` library we need:

1. [`http.createServer([requestListener])`](https://nodejs.org/api/http.html#http_class_http_server)

  Creates a new [`server`](https://nodejs.org/api/http.html#http_class_http_server)
  that will call `requestListener` when it receives a request.

  `requestListener` is function that takes two arguments `req` and `res`.
    1. `req` is an [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object. It has:

    `req.url`: the full URL of the request including query string.

    `req.method`: the HTTP method of the request.
    1. `res` is an
  [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) object. It has:

    `res.writeHead(statusCode, headersObject)`: Sets the status code and headers
    for the response. The `headersObject` is an object where header names are
    keys and header values are values.

    `res.end(body)`: Send the response body and terminate the request.
    `body` is a string that contains the whole response body.
1. [`http.Server.listen(port)`](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback)

  Begin accepting connections on the specified port.

## Exercise 1: `.listen()` and `.get()`

Open `week04/day5/hexpress.js`.

You will need to implement the `hexpress` function a new `hexpress` application
when called. (Just like `var app = express()`.) This application will have
two methods:

1. `.get(url, callback)`: add a new endpoint that listens to `GET`
  requests where the URL is exactly `url` (excluding the query string).

### Verification

Run `node exercise1.js` and verify that all routes in `exercise1.js` work
correctly. Read the comments in `exercise1.js`, they specify the expected
behavior of all routes.

## Exercise 2:
