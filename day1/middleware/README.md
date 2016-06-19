# Inline exercise: Express middleware
## Time limit: 10 minutes

## Goal

Your goal is to write some simple Express middleware. Your app should do the
following:

- When a user visits any page on your site, you should check for the existence
  of a `req.user` property to see if they've been authenticated.
- If `req.user` is unset (the user is new, or hasn't logged in yet), you should
  display a login form. The form should have a single field, which asks a user
  for their username. You should keep track of the page the user tried to visit,
  e.g., `/somecontent`.
- When the user submits the login form, you should set `req.user` to a user
  object representing this user with a single username property, like this:
  ```javascript
  req.user = {username: username};
  ```
- Then you should `redirect()` the user back to the page they originally tried
  to access. If there is no original page, e.g., they accessed `/login`
  directly, you should redirect them to `/`.
- Display a welcome message to the user on the `/` route which includes their
  username, e.g., "Welcome to my site, Ethanello2449!"

## Instructions

Use the express app scaffolding in the `skeleton/` folder. Run the app locally
using `npm start` or `nodemon`.
