
//route for new index file.  passport.authenticate is spedifying our 'local' strategy we created and specifies
// and success redirect.
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.get('/', function(req, res, next){
  res.sendFile(path.resolve(__dirname, '../public/views/index.html'));
});

router.post('/',
  passport.authenticate('local', {
    sucessRedirect: '/users',
    failureRedirect: '/'
  })
);

module.exports = router;
