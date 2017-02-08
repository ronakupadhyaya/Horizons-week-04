# Inline Exercise: GitHub OAuth

## Goal

In this exercise we're going to implement logins using GitHub OAuth.

## Instructions

1. [Register a new OAuth application with GitHub](https://github.com/settings/developers)
  1. Pick a fun application name
  1. Set "Homepage URL" to `http://localhost:3000`
  1. Set "Authorization callback URL" to `http://localhost:3000/auth/github/callback`
1. Create a new file `env.sh` in `week04/day3/oauth` put the Client ID and Client
  Secret for your new app there:

  ```bash
  export GITHUB_CLIENT_ID="YOUR CLIENT ID HERE"
  export GITHUB_CLIENT_SECRET="YOUR CLIENT SECRET HERE"
  ```

1. Run `source env.sh` to import environment variables from `env.sh`
1. NPM install `passport-github`
1. Follow directions from
  [`passport-github` documentation](https://github.com/jaredhanson/passport-github)
  1. Create a new GitHub strategy and put it in the marked place in `routes.js`
  1. Create `GET /auth/github` and `GET /auth/github/callback` endpoints in
    `routes.js`
1. Start your app and open it in your browser. Click `Login with GitHub` and
  confirm the GitHub login prompt. You should see the message:

  ```
  Your GitHub username is: [your GitHub username here]
  ```
