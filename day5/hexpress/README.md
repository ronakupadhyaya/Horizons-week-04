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
1. Implement `.post(route, callback)`
  1. Add support for `req.body`
    - Like `req.query` but only available for posts. Use
      [query-string NPM package](https://www.npmjs.com/package/query-string) to do parsing.
1. Implement `.use(routePrefix, callback)`
1. Implement `req.params`
1. Express with `next()`
  1. Callback has third parameter `next` function
1. `res.render()`
