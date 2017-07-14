expressSession() is middleware
middleware catches a request and then releases it

body-parser parses out the body so that req.body can happen
strategy just tells you how to authenticate your user

in login.hbs, action="/login" is where the route goes, <span> puts it in all one line

var User = require('./') means this directory, and ../ means the directory above that

mongoose schema options: enum makes it so that only these restricted certain values
can be used

the model is a constructor and the first letter is capitalized
