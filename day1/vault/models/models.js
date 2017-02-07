var User = mongoose.model('User', schema);

app.get ('/signup', function(req, res) {
  res.render('signup.hbs')
});

app.post('/signup', passport.authenticate('local', {
  //validates username and password fields from req.body-parser
  req.body.u
}))

module.exports
