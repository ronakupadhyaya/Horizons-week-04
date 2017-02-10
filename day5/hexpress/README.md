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
1. Bonus: `res.render()`
1. Double bonus: `res.render()` with layouts

## [`http`](https://nodejs.org/api/http.html)

The primary purpose of Express is to listen for and respond to incoming HTTP
requests. We're going to use the Node built-in library `http` to assist
us in this task.

The `http` library can be accessed via, `require('http')`. You **do not** need
to `npm install` it.

Here are the things we'll need to use from the `http` library to build our
server:

1. 


## Exercise 1: `.listen()` and `.get()`

### Verification

To verify your code run `node exercise1.js`. Read the instruction

## Exercise 2:
