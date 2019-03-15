var mysql = require('mysql');

const GOOD_STATUS = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERR = 500;
// Constructor for DB connection pool
var CnnPool = function() {
   var poolCfg = require('./connection.json');

   poolCfg.connectionLimit = CnnPool.PoolSize;
   this.pool = mysql.createPool(poolCfg);
};

CnnPool.PoolSize = 1;

// The one (and probably only) CnnPool object needed for the app
CnnPool.singleton = new CnnPool();

// Conventional getConnection, drawing from the pool
CnnPool.prototype.getConnection = function(cb) {
   this.pool.getConnection(cb);
};

// Router function for use in auto-creating CnnPool for a request
CnnPool.router = function(req, res, next) {
   var r = res;
   console.log("Getting connection");
   CnnPool.singleton.getConnection(function(err, cnn) {
      if (err)
         res.status(SERVER_ERR).json('Failed to get connection ' + err);

      else {
         console.log("Connection acquired");
         cnn.chkQry = function(qry, prms, cb) {
            // Run real qry, checking for error
            this.query(qry, prms, function(err, res, fields) {
               if (err)
                  r.status(SERVER_ERR).json('Failed query ' + qry);
               cb(err, res, fields);
            });
         };

         req.cnn = cnn;
         next();
      }
   });
};

module.exports = CnnPool;
