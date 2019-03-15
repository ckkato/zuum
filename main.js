var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var async = require('async');

const GOOD_STATUS = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
   res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
   res.header("Access-Control-Request-Headers", 'Content-Type');
   res.header("Access-Control-Expose-Headers", 'Location');
   res.header("Access-Control-Allow-Headers",
    ["Content-Type", 'access-control-allow-headers',
    'access-control-allow-origin', 'access-control-allow-credentials']);
  next();
});

// No further processing needed for options calls.
app.options("/*", function(req, res) {
   res.status(GOOD_STATUS).end();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   console.log(req.path);
   if (req.session || (req.method === 'POST' &&
    (req.path === '/Usrs' || req.path === '/Ssns'))) {
      req.validator = new Validator(req, res);
      next();
   } else
      res.status(UNAUTHORIZED).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/Usrs', require('./Routes/Account/Usrs.js'));
app.use('/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/Rds', require('./Routes/Ride/Rds.js'));
app.use('/Rqts', require('./Routes/Ride/Rqts.js'));


app.delete('/DB', function(req, res) {
   // Callbacks to clear tables
   if (req.session.isAdmin()) {
   var cbs = ["Ride", "Request", "User"].map(function(tblName) {
      return function(cb) {
         req.cnn.query("delete from " + tblName, cb);
      };
   });

   // Callbacks to reset increment bases
   cbs = cbs.concat(["Ride", "Request", "User"].map(function(tblName) {
      return function(cb) {
         req.cnn.query("alter table " + tblName + " auto_increment = 1", cb);
      };
   }));

   // Callback to reinsert admin user
   cbs.push(function(cb) {
      req.cnn.query('INSERT INTO User (firstName, lastName, email,' +
          ' password, role) VALUES ' +
          '("Clint", "Admin", "senpaiClint@437.com","password", 2);', cb);
   });

   // Callback to clear sessions, release connection and return result
   cbs.push(function(callback){
      for (var session in Session.sessions)
         delete Session.sessions[session];
      callback();
   });

   async.series(cbs, function(err) {
      req.cnn.release();
      if (err)
         res.status(BAD_REQUEST).json(err);
      else
         res.status(GOOD_STATUS).end();
   });}

   else {
      res.status(FORBIDDEN).end();
      req.cnn.release();
   }
});

// Handler of last resort.
// Print a stacktrace to console and send a 500 response.
app.use(function(req, res) {
   res.status(NOT_FOUND).end();
   req.cnn.release();
});

app.use(function(err, req, res, next) {
   res.status(SERVER_ERR).json(err.stack);
   req.cnn && req.cnn.release();
});

app.listen(process.argv[3], function () {
   if (process.argv[2] == "-p")
      console.log('App Listening on port ' + process.argv[3]);
});
