var passport = require('passport') // require it

var cookieParser = require('cookie-parser')
app.use(cookieParser())

set a cookie:


passport.use(new LocalStrategy(
  function(username, password, done) {
    done(null, 'THIS IS A USER') // sets user as that str
  }
))

passport.serializeUser(function(user, done) {
  console.log('serialize user', user)
  done(null, 'id') // creates new session
})

passport.deserializeUser(function(id, done) {
  console.log('deserialize user', 'c') // req.user='c'
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.use(function(req, res, next) {
  if(userloggedin) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.use(expressSession({

}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', function(req, res) {
  if (! req.user) {
    //boot them back
  } else {
    next()
  }
})
