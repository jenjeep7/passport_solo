var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var pg = require('pg');
//sessions provide a way to identify user across more than one page requst
var session = require('express-session');
//reference to modules strategy object
var localStrategy = require('passport-local').Strategy;
var app = express();
//connect to dababase
var connectionString = 'postgres://localhost:5432/passport_users';

//routes
var index = require('./routes/index');
var register = require('./routes/register');
var users = require('./routes/users');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));
app.use('/', index);
app.use('/register', register);
app.use('/users', users);


//session information

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure: false}
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport  telling passport which strategy to user inside our server.js file
passport.use('local', new localStrategy({passReqToCallback : true, usernameField: 'username'},
  function(req, username, password, done) {
      //come back to this
      console.log('called local - pg');

      var user = {};

        var query = client.query("SELECT * FROM users WHERE username = $1", [username]);

        query.on('row', function(row) {
          console.log('User obj', row);
          console.log('Password', password);
          user = row;
          if(password == user.password){
            console.log('match!');
            done(null, user);
          } else {
            done(null, false, {message: 'Incorrect username and password. '});
          }
        });

    //After all data is returned, close connection and return results
    query.on('end', function(){
        client.end();
        res.send(results);
    });
    //handle errors
    if(err) {
      console.log(err);
    }
  }));

//function for authenticating users.  Serialize and deserialize allow user information to be stored and retrieved from session.
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    console.log('called deserializeUser');
    pg.connect(connection, function(err, client){

      var user = {};
      console.log('called deserializeUser - pg');
        var query = client.query("SELECT * FROM users WHERE id = $1", [id]);

          query.on('row', function(row) {
            console.log('User row', row);
            user = row;
            done(null, user);
          });
          //after all data is returned, close connection and return results
          query.on('end', function(){
            client.end();
          });

          //handle errors
          if(err){
            console.log(err);
          }

    });
});



var server = app.listen(process.env.PORT || 3000, function(){
  var portGrabbedFromLiveServer = server.address().port;

  console.log('Listening on port', portGrabbedFromLiveServer);
});
