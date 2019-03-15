var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
router.baseURL = '/Cnvs';
const GOOD_STATUS = 200;
const MSG_LEN = 5000;
const TITLE_LEN = 80;

router.get('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var id = req.query.owner;

   if (!id) {
      cnn.chkQry('select * from Conversation', null,
       function(err, cnvs) {
         if (!err) {
            for (var i = 0; i < cnvs.length; i++) {
               if (cnvs[i].lastMessage)
                  cnvs[i].lastMessage = cnvs[i].lastMessage.getTime();
            }

            res.json(cnvs);
         }
         req.cnn.release();
      });

   } else {
      cnn.chkQry('select * from Conversation where ownerId = ?', [id],
       function(err, cnvs) {
          if (!err) {
             for (var i = 0; i < cnvs.length; i++) {
                if (cnvs[i].lastMessage)
                   cnvs[i].lastMessage = cnvs[i].lastMessage.getTime();
             }

             res.json(cnvs);
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
      if (vld.check(('title' in body) && body.title,
       Tags.missingField, ['title'], cb)
       && vld.check(('title' in body) && body.title.length <= TITLE_LEN,
       Tags.badValue, ['title'], cb))
         cnn.chkQry('select * from Conversation where title = ?',
          body.title, cb);
   },

   function(existingCnv, fields, cb) {
      if (vld.check(!existingCnv.length, Tags.dupTitle, null, cb)) {
         body.ownerId = req.session.id;
         cnn.chkQry("insert into Conversation set ?", body, cb);
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
      if (cnvs && vld.check(cnvs.length, Tags.notFound, null, cb)
       && vld.checkPrsOK(cnvs[0].ownerId, cb) &&
       vld.check(('title' in body), Tags.missingField, ['title'], cb)) {
         cnn.chkQry('select * from Conversation where title = ?',
          [body.title], cb);
      }
   },

   function(sameTtl, fields, cb) {
      if (vld.check(!sameTtl.length, Tags.dupTitle, null, cb))
         cnn.chkQry("update Conversation set title = ? where id = ?",
          [body.title, cnvId], cb);
   },

   function (result, fields, cb) {
      res.status(GOOD_STATUS).end();
      cb();
   }],

   function(err) {
      req.cnn.release();
   });
});

router.get('/:cnvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },

   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb)) {
         if (cnvs[0]) {
            if (cnvs[0].lastMessage)
               cnvs[0].lastMessage = cnvs[0].lastMessage.getTime();

            else
               cnvs[0].lastMessage = null;
            res.json(cnvs[0]);
            cb();
         }

         else {
            res.json(cnvs);
            cb();
         }
      }
   }],

   function(err) {
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
      if (cnvs && vld.checkPrsOK(cnvs[0].ownerId, cb) &&
       vld.check(cnvs.length, Tags.notFound, null, cb)) {
         cnn.chkQry('delete from Conversation where id = ?', [cnvId], cb);
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
