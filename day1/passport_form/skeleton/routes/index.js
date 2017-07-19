var router = require('express').Router();

module.exports = function(passport) {

  router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
      res.render('index', { title: 'Express' });
    } else {
      res.redirect("/login");
    }
  });

  return router;
};
