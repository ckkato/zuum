var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
const GOOD_STATUS = 200;

router.baseURL = '/Msgs';

router.get('/', function(req, res) {
   req.cnn.chkQry(req.validator, 'select id, title from Conversation', null,
    function(err, cnvs) {
       if (!err)
          res.json(cnvs);
       req.cnn.release();
    });
});

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where title = ?', body.title, cb);
   },

   function(existingCnv, fields, cb) {
      if (vld.check(!existingCnv.length, Tags.dupTitle, null, cb))
         cnn.chkQry("insert into Conversation set ?", body, cb);
   },

   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cb();
   }],

   function() {
      cnn.release();
   });
});

router.put('/:cnvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(result[0].prsId, cb))
         cnn.chkQry('select * from Conversation where id <> ? && title = ?',
          [cnvId, body.title], cb);
   },

   function(sameTtl, fields, cb) {
      if (vld.check(!sameTtl.length, Tags.dupTitle, cb))
         cnn.chkQry("update Conversation set title = ? where id = ?",
          [body.title, cnvId], cb);
   }],

   function(err) {
      if (!err)
         res.status(GOOD_STATUS).end();
      req.cnn.release();
   });
});

router.delete('/:cnvId', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(result[0].prsID, cb))
         cnn.chkQry('delete from Conversation where id = ?', [cnvId], cb);
   }],

   function(err) {
      if (!err)
         cnn.status(GOOD_STATUS);
      cnn.release();
   });
});

router.get('/:msgId', function(req, res) {
   var vld = req.validator;
   var msgId = req.params.msgId;
   var cnn = req.cnn;
   var msg;

   async.waterfall([
   function(cb) {  // Check for existence of conversation
      cnn.chkQry('select * from Message where id = ?', [msgId], cb);
   },

   function(msgs, fields, cb) { // Get indicated messages
      if (vld.check(msgs.length, Tags.notFound, null, cb)) {
         msg = msgs;
         cnn.chkQry('select email from Person where id = ?',
          [msg[0].prsId], cb);
      }
   },

   function(emails, fields, cb) {
      msg[0]['email'] = emails[0].email;
      res.json(msg[0]);
      cb();
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

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb))
         cnn.chkQry('insert into Message set ?',
          {cnvId: cnvId, prsId: req.session.id,
          whenMade: now = new Date(), content: req.body.content}, cb);
   },

   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).end();
      cnn.chkQry("update Conversation set lastPost = ? where id = ?",
       [now, cnvId], cb);
   }],

   function(err) {
      cnn.release();
   });
});

module.exports = router;
