var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
var async = require('async');
const GOOD_STATUS = 200;

router.baseURL = '/Ssns';

router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }
      res.json(body);

   }
   req.cnn.release();
});

router.post('/', function(req, res) {
   var cookie = req.cookie;
   var cnn = req.cnn;
   var validator = req.validator;

   async.waterfall([
      function(cb) {
         cnn.query('select * from User where email = ?',
          [req.body.email], cb);
      },

      function(result, fields, cb) {
         if (req.validator.check(result && result.length &&
          result[0].password === req.body.password,
          Tags.badLogin, null, cb)) {
            cookie = ssnUtil.makeSession(result[0], res);
            res.location(router.baseURL + '/' + cookie)
             .status(GOOD_STATUS).end();
            cb();
         }
      }],

      function(err) {
         cnn.release();
      });
});

// DELETE ..../SSns/ff73647f737f7
router.delete('/:cookie', function(req, res) {
   vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.isAdmin() ||
       req.params.cookie === req.cookies[ssnUtil.cookieName],
       Tags.noPermission, null, cb)) {
         ssnUtil.deleteSession(req.params.cookie);
         res.status(GOOD_STATUS).end();
         cb();
      }
   }],

   function(err) {
      req.cnn.release();
   });
});

router.get('/:cookie', function(req, res) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (req.session.isAdmin() || vld.chain(!req.session.isAdmin() &&
       ssnUtil.sessions[cookie], Tags.notFound)
       .check(!req.session.isAdmin() && cookie ==
       req.cookies[ssnUtil.cookieName], Tags.noPermission, null, cb)) {

         var bod = {
            prsId: req.session.id,
            cookie: cookie,
            loginTime: ssnUtil.sessions[cookie].loginTime
         };
         console.log(bod);
         res.json(bod);
         cb();
      }
   }],

   function(err) {
      req.cnn.release();
   });
});

module.exports = router;
