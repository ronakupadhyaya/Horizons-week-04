# HW4D1 | Individual | Passport-Form

Up until now, you've been creating applications that stores users and does very 
simple authentication. Now you're going to learn how to use 
[Passport](http://passportjs.org) to make authenticating and verifying your user much easier.

## Goal

In this exercise, you're going to be creating a simple app that does only a few 
key things:

+ lets users register
+ lets users login
+ lets users logout
+ lets **logged in** users view a special page


## Instructions

1. Install dependencies

  In this exercise, we're going to be using **Express** as our web framework,
  **Mongoose** handling our data storage and modeling, **Handlebars** as our
  templating engine, and **Passport** as our authentication middleware. There
  are a few other dependencies here and there and you can check them out in the
  `package.json`, but those are the major technologies at play here.
  
  You can install them like always by running:
  
  ```bash
  $ npm install
  ```

1. The registration flow

  First things first, we're going to work on the registration flow. A **flow**
  can be characterized as Like before, create a simple registration form that
  has three fields:
  
| field name | input type | description |
| --- | --- | --- |
| username | text | username of the user |
| password | password | password for the user |
| passwordConf | password | password confirmation for the user ||

1. The login and logout flow

1. The secret page

  Finally, we're going to restrict users from looking at certain pages/accessing
  certain routes if they're not logged in.

## References
