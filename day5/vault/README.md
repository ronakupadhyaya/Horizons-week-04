# The Vault (pair exercise)

## Contents


## Goal

Your goal is to build a backend webapp that stores top secret sensitive data.
You'll start by building a basic authentication system, then make it more robust
over the course of the project.


## Instructions

Work in the `skeleton/` directory. You'll need to add code to the `app.js`,
`routes/`, and `models/` files.


## Phase 1. Local Strategy

Take a look at the `passwords.plain.json` and `passwords.hashed.json` files.
These files include a set of user accounts in cleartext and hashed format,
respectively.

Start by installing passport and the passport-local strategy. In the past, we gave
you an Express application with passport and passport-local already installed.
Well...now you are all grown up. Time to install them on your own!
(Hint: Try `npm install passport` and `npm install passport-local`. Make sure to then
require both in your `app.js` file appropriately. 

Then build your own strategy to authenticate users using the accounts in these files. You should
also add the necessary routes to allow users to login, and to ensure that only
authenticated users can access the `/` (root) route. The views have been filled
in for you.

Note that you do *not* need routes to register new users at this stage--you
should not be modifying these files, and you should only allow users identified
in these files to login.

Once you've got this working using the cleartext file, try getting it to work
using the hashed version. Use the hash function provided in `hashPassword.js`.


## Phase 2. Sessions

Once you've got the local strategy working, let's get sessions working as well.
Why do we need sessions? Why are sessions useful? Good questions, champ! 
In a typical web application, the credentials used to authenticate a user
will only be transmitted during the login request. If authentication succeeds,
a session will be established and maintained via a cookie set in the user's browser.
Each subsequent request will not contain credentials, but rather the unique 
cookie that identifies the session.

Install the `express-session` module and configure it in `app.js`. Do you remember
how to do this? No? Fear not, we have some hints for you. Make sure to first require
the `express-session` module in your `app.js` file. Make sure to then appropriately
add `app.use` with your new session module (look up Double Message again if you 
need a more robust hint). Make sure to also use the `serializeUser` and `deserializeUser`
functions with passport. 

The`index.hbs` view contains a form that lets the user add a message to the
session, and it displays all of the messages they've previously added to the
session. Add a route that makes this possible. You can access the current
session through `req.session` and the messages through `req.session.messages`.

Use the `cookie` argument when configuring the session to make the cookie expire
after a specified period of time. Once you get sessions working, experiment with
different expiration times and see what effect it has when you log in, and
reload.


## Phase 3. Make sessions persistent

Up to now all of the sessions you've seen have existed only in memory. Let's
persist the sessions to the database, so that you can stop and restart the
server, and the session--and your active login--won't go away. You'll need to
use the `store` argument and the
[connect-mongo](https://github.com/kcbanner/connect-mongo) module when
configuring the session in `app.js.` See also the
[express-session](https://github.com/expressjs/session) module documentation.


## Phase 4. A better strategy

Let's improve our passport strategy, and try storing user accounts in the
database. Rewrite your `LocalStrategy` to store users in the database, and
create the necessary models in `models/models.js`. Get this working using
plaintext passwords first, as before, then switch to hashing them, using the
hash function mentioned above. Note that when you turn hashing on, you may need
to delete the unhashed documents from your user collection in order to
authenticate.


## BONUS

- Add OAuth authentication using Facebook, Twitter, Instagram or another OAuth
  provider. Allow users to link accounts.
- Try encrypting and decrypting the contents of the session using a key such as
  the user ID, hashed password, or something else.
- Structure your data so that users can only view their own messages, or can
  send messages to other users. How do you transfer the data from one user's
  session to another's?
