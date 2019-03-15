var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
router.baseURL = '/Rds';
const GOOD_STATUS = 200;
const MSG_LEN = 5000;

router.get('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var id = req.query.driver;

   if (!id) {
      cnn.chkQry('select * from Ride', null,
       function(err, rds) {
         if (!err) {
            for (var i = 0; i < rds.length; i++) {
               if (rds[i].lastMessage)
                  rds[i].lastMessage = rds[i].lastMessage.getTime();
               if (!rds[i].curRiders)
                  rds[i].curRiders = 0;
            }

            res.json(rds);
         }
         req.cnn.release();
      });

   } else {
      cnn.chkQry('select * from Ride where driverId = ?', [id],
       function(err, rds) {
          if (!err) {
             for (var i = 0; i < rds.length; i++) {
                if (rds[i].lastMessage)
                   rds[i].lastMessage = rds[i].lastMessage.getTime();
                if (!rds[i].curRiders)
                   rds[i].curRiders = 0;
             }

             res.json(rds);
          }
          req.cnn.release();
       });
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      console.log("noooo", body);
      if (vld.chain(('startDestination' in body) && body.startDestination,
       Tags.missingField, ['startDestination'])
       .chain(('endDestination' in body) && body.endDestination,
       Tags.missingField, ['endDestination'])
       .chain(('departureTime' in body) && body.departureTime,
       Tags.missingField, ['departureTime'])
       .chain(('capacity' in body) && body.capacity, Tags.missingField,
       ['capacity'])
       .check(('fee' in body) && body.fee, Tags.missingField, ['fee'], cb)) {

         console.log("time: ", body.departureTime);
         body.departureTime = new Date(parseInt(body.departureTime));
         console.log("time: ", body.departureTime);
         body.driverId = req.session.id;
         cnn.chkQry('insert into Ride set ?', body, cb);
       }
   },

   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }],

   function() {
      cnn.release();
   });
});

router.put('/:rdId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var rdId = req.params.rdId;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Ride where id = ?', [rdId], cb);
   },

   function(rds, fields, cb) {
      if (rds && vld.check(rds.length, Tags.notFound, null, cb)
       && vld.checkPrsOK(rds[0].driverId, cb)) {
         cnn.chkQry('update Ride set fee = ? where id = ?',
          [body.fee, rdId], cb);
      }
   },

   function (result, fields, cb) {
      res.status(GOOD_STATUS).end();
      cb();
   }],

   function(err) {
      req.cnn.release();
   });
});

router.get('/:rdId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var rdId = req.params.rdId;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Ride where id = ?', [rdId], cb);
   },

   function(rds, fields, cb) {
      if (vld.check(rds.length, Tags.notFound, null, cb)) {
         if (rds[0]) {
            if (rds[0].departureTime)
               rds[0].departureTime = rds[0].departureTime.getTime();
            else
               rds[0].departureTime = null;
            if (!rds[0].curRiders)
               rds[0].curRiders = 0;
            res.json(rds);
            cb();
         }

         else {
            res.json(rds);
            cb();
         }
      }
   }],

   function(err) {
      req.cnn.release();
   });
});

router.delete('/:rdId', function(req, res) {
   var vld = req.validator;
   var rdId = req.params.rdId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Ride where id = ?', [rdId], cb);
   },

   function(rds, fields, cb) {
      if (rds && vld.checkPrsOK(rds[0].driverId, cb) &&
       vld.check(rds.length, Tags.notFound, null, cb)) {
         cnn.chkQry('delete from Ride where id = ?', [rdId], cb);
      }

   },

   function (result, fields, cb) {
      res.status(GOOD_STATUS).end();
      cb();
   }],

   function(err) {
      cnn.release();
   });
});

router.get('/:rdId/Rqts', function(req, res) {
   var vld = req.validator;
   var rdId = req.params.rdId;
   var cnn = req.cnn;

   // And finally add a limit clause and parameter if indicated.

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noLogin, null, cb))
         cnn.chkQry('select driverId from Ride where id = ?', [rdId], cb);
   },
   function(driverId, fields, cb) {
      if (vld.check(driverId[0].driverId === req.session.id,
       Tags.noPermission, null, cb)) {
         cnn.chkQry('select * from Request where rideId = ?', [rdId], cb);
      }
   },
   function(rqts, fields, cb) {
      delete rqts[0]['rideId'];
      res.json(rqts);
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

//Post rides request
router.post('/:rdId/Rqts', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rdId = req.params.rdId;
   var body = req.body;
   body.accepted = 0;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noLogin, null, cb)) {
         cnn.chkQry('select role from User where id = ?', req.session.id, cb);
      }
   },
   function(role, fields, cb) {
      if (vld.check(role[0].role === 0, Tags.noPermission, null, cb)) {
         cnn.chkQry('select driverId from Ride where id = ?', rdId, cb);
      }
   },
   function(driverId, fields, cb) {
      if (vld.hasFields(body, ["email", "firstName", "lastName"], cb) &&
       vld.chain(body.email != '', Tags.missingField, ["email"])
       .chain(body.firstName != '', Tags.missingField, ["firstName"])
       .check(body.lastName != '', Tags.missingField, ["lastName"], cb)) {
         body.sndId = req.session.id;
         body.rcvId = driverId[0].driverId;
         body.rideId = parseInt(rdId);
         console.log("Body");
         console.log(body);
         cnn.chkQry('insert into Request set ?', body, cb);
      }
   },
   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

module.exports = router;
