var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
const GOOD_STATUS = 200;

router.put('/:rqtId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var rqtId = req.params.rqtId;
   var curId = req.session.id;
   var cnn = req.cnn;
   var rideIdent;


   async.waterfall([
   function(cb) {
      if (vld.check(curId, Tags.noLogin, null, cb))
         cnn.chkQry('select rcvId, rideId from Request where id = ?',
         rqtId, cb);
   },
   function(rcvId, fields, cb) {
      if (vld.check(rcvId.length, Tags.notFound, null, cb) &&
       vld.check(rcvId[0].rcvId === curId, Tags.noPermission, null, cb) &&
       vld.chain(!('email' in body), Tags.forbiddenField, ['email'])
       .chain(!('firstName' in body), Tags.forbiddenField, ['firstName'])
       .chain(!('lastName' in body), Tags.forbiddenField, ['lastName'])
       .check(body.accepted === 1, Tags.badValue, ['accepted'], cb)) {
         rideIdent = rcvId[0].rideId;
         cnn.chkQry('select capacity, curRiders from Ride where id = ?',
          rcvId[0].rideId, cb);
      }
   },
   function(result, fields, cb) {
      if (vld.check(result[0].capacity > result[0].curRiders, Tags.rideFull,
       null, cb))
         cnn.chkQry('update Ride set curRiders = curRiders + 1 where id = ?',
          rideIdent, cb);
   },
   function(result, fields, cb) {
      cnn.chkQry('update Request set accepted = 1 where id = ?', rqtId, cb);
   }],

   function(err) {
      if (!err)
         res.status(GOOD_STATUS).end();
      req.cnn.release();
   });
});

router.delete('/:rqtId', function(req, res) {
   var vld = req.validator;
   var rqtId = req.params.rqtId;
   var cnn = req.cnn;
   var curId = req.session.id;
   var cbFlag = 0;
   var qry = 'update Ride set curRiders = GREATEST(0, curRiders - 1) ' +
   'where id = ?';

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noLogin, null, cb))
         cnn.chkQry('select sndId, rcvId from Request where id = ?',
         rqtId, cb);
   },

   function(idInfo, fields, cb) {
      if (vld.check(idInfo.length, Tags.notFound, null, cb) &&
       vld.check(idInfo[0].sndId === curId || idInfo[0].rcvId === curId,
       Tags.noPermission, null, cb)) {
         cnn.chkQry('select accepted, rideId from Request where id = ?',
          rqtId, cb);
      }
   },
   function(vals, fields, cb) {
      if (vals[0].accepted === 1) {
         cbFlag = 1;
         cnn.chkQry(qry, vals[0].rideId, cb);
      }
      else {
         cb();
      }
   },
   //cb1 is if logic goes into else | cb2 is if it performs the qry statement
   function(cb1, fields, cb2) {
      if (cbFlag)
         cnn.chkQry('delete from Request where id = ?', rqtId, cb2);
      else
         cnn.chkQry('delete from Request where id = ?', rqtId, cb1);
   }],

   function(err) {
      if (!err)
         res.status(GOOD_STATUS).end();
      cnn.release();
   });
});

router.get('/:rqtId', function(req, res) {
   var vld = req.validator;
   var rqtId = req.params.rqtId;
   var cnn = req.cnn;
   var qry = "select email, firstName, lastName, accepted " +
   "from Request where id = ?";

   async.waterfall([
   function(cb) {  // Check for existence of conversation
      if (vld.check(req.session.id, Tags.noLogin, null, cb))
         cnn.chkQry('select rcvId from Request where id = ?', [rqtId], cb);
   },

   function(rcvId, fields, cb) { // Get indicated messages
      if (vld.check(rcvId.length, Tags.notFound, null, cb))
         cnn.chkQry(qry, [rqtId], cb);
   },
   function(rqtInfo, fields, cb) {
      res.json(rqtInfo);
      cb();
   }],

   function(err){
      cnn.release();
   });
});

module.exports = router;
