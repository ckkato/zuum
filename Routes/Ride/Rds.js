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

router.get('/:cnvId/Msgs', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;
   var query = 'select m.id, whenMade, email, content from Conversation c' +
    ' join Message m on cnvId = c.id join Person p on prsId = p.id' +
    ' where c.id = ? order by m.id asc';
   var params = [cnvId];
   var num = req.query.num;
   var date = req.query.dateTime;

   // And finally add a limit clause and parameter if indicated.

   async.waterfall([
   function(cb) {  // Check for existence of conversation
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) { // Get indicated messages
      if (vld.check(cnvs.length, Tags.notFound, null, cb)) {
         if (date) {
            query = 'select m.id, whenMade, email, content from' +
             ' Conversation c join Message m on cnvId = c.id' +
             ' join Person p on prsId = p.id where c.id = ? and' +
             ' m.whenMade <= ? order by m.whenMade, m.id asc';
            cnn.chkQry(query, [cnvId, new Date(parseInt(date))], cb);
         }

         else
            cnn.chkQry(query, params, cb);
      }
   },

   function(msgs, fields, cb) { // Return retrieved messages
      if (num) {
         var mes = [];

         for (var i = 0; i < num; i++) {
            mes[i] = msgs[i];
            if (mes[i].whenMade)
               mes[i].whenMade = msgs[i].whenMade.getTime();
         }

         res.json(mes);
         cb();
      }

      else {
         for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].whenMade)
               msgs[i].whenMade = msgs[i].whenMade.getTime();
         }
         res.json(msgs);
         cb();
      }
   }],

   function(err){
      cnn.release();
   });
});

router.post('/:cnvId/Msgs', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var now;
   var c;
   var id;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
       vld.check(('content' in req.body), Tags.missingField, ['content'], cb) &&
       vld.check(req.body.content && req.body.content.length <= MSG_LEN,
       Tags.badValue, ['content'], cb)) {
         console.log('about to query');
         cnn.chkQry('insert into Message set ?',
          {cnvId: cnvId, prsId: req.session.id,
          whenMade: now = new Date(), content: req.body.content}, cb);
      }
   },

   function(cnv, fields, cb) {
      id = cnv.insertId;
      cnn.chkQry('update Conversation set lastMessage = ? where id = ?',
       [now, cnvId], cb);
   },

   function(result, fields, cb) {
      res.location(router.baseURL + '/' + id).end();
      cb();
   }],

   function(err) {
      cnn.release();
   });
});

module.exports = router;
