
//This alone will do nothing
//If you do a call from client(a GET request) to the /users route then
//console log out the response in the success callback function.
//You will se what the server sends back for whether or not the user is authenticated.
//You could also add a route to send a response of req.user to get info about the user

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.send(req.isAuthenticated());

});



module.exports= router;
