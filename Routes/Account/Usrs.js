var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
var mysql = require('mysql');

var router = Express.Router({caseSensitive: true});

router.baseURL = '/Usrs';

const GOOD_STATUS = 200;

//.../Prss?email=cstaley
router.get('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var email = req.query.email;

   if (!email){
     console.log("in no email");
     async.waterfall([
     function(cb) {
         cnn.chkQry('select id, email from User', cb);
     },

     function(result, fields, cb) {
        console.log("result: ", result);
        res.json(result);
        cb();
     }],

     function(err) {
        cnn.release();
     })
   }
   else {
      async.waterfall([
      function(cb) {
        if (req.query && (email.toLowerCase())
         .includes(req.query.email.toLowerCase())) {
           cnn.chkQry('select id, email from User'  +
            ' where email like lower(?)', [req.query.email + '%'], cb);
        }

        else {
            cnn.chkQry('select 1 from dual where false', null, cb);
        }

      },

      function(person, fields, cb) {
         res.json(person);
      	 cb();
      }],

      function(err) {
         req.cnn.release();
      });
   }

});

/* Much nicer versions
*/
router.get('/', function(req, res) {
   var email = req.session.isAdmin() && req.query.email ||
    !req.session.isAdmin() && req.session.email;

   if (email)
      req.cnn.chkQry('select id, email from User where email like ?',
       [email + '%'], handler);
   else
      req.cnn.chkQry('select id, email from User', handler);
});



router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*";             // Blocking password

   async.waterfall([

   function(cb) { // Check properties and search for Email duplicates
      if (body.role !== 1 ? vld.hasFields(body, ["email", "password", "role",
       "firstName", "lastName"], cb) : vld.hasFields(body,
       ["email", "password", "role", "firstName", "lastName",
       "make", "model", "year"], cb) &&
       vld.chain(body.email != '', Tags.missingField, ["email"])
       .chain(body.password != '', Tags.missingField, ["password"])
       .chain(body.firstName != '', Tags.missingField, ["firstName"])
       .chain(body.lastName != '', Tags.missingField, ["lastName"])
       .chain(typeof body.role === 'number', Tags.missingField, ["role"])
       .chain(body.role === 1 && body.make && body.make
        != '', Tags.missingField, ["make"])
       .chain(body.role === 1 && body.model && body.model
        != '', Tags.missingField, ["model"])
       .chain(body.role === 1 && body.year && body.year
        != '', Tags.missingField, ["year"])
       .check(body.role >= 0 && body.role <= 2, Tags.badValue, ["role"], cb)) {

         cnn.chkQry('select * from User where email = ?', body.email, cb)
      }
   },

   function(existingUsrs, fields, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingUsrs.length, Tags.dupEmail, null, cb)) {
         cnn.chkQry('insert into User set ?', body, cb);
      }
   },

   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],

   function(err) {
      cnn.release();
   });
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var admin = req.session && req.session.isAdmin();

   if (Object.keys(body).length > 0) {
      async.waterfall([

      function(cb) {
         if (vld.checkPrsOK(req.params.id, cb) &&
      	  vld.chain(!('password' in body) || body.password, Tags.badValue,
          ['password'])
          .chain(vld.checkFields(body))

      	  .check(!('password' in body) || ('oldPassword' in body),
          Tags.noOldPwd, null, cb)) {
      	    cnn.chkQry("select * from User where id = ?",
             [req.params.id], cb);
         }
      },

      function(foundPrs, fields, cb) {
         if (vld.check(foundPrs.length, Tags.notFound, null, cb) &&

          vld.check(!('password' in body) ||
          body.oldPassword === foundPrs[0].password || admin,
          Tags.oldPwdMismatch, null, cb)) {

            delete body.oldPassword;
            cb();
         }
      },

      function(cb, err) {
   	     cnn.chkQry("update User set ? where id = ?",
          [body, req.params.id], cb);
      },

      function(result, fields, cb) {
         res.location(router.baseURL + '/' + result.insertId).end();
         cb();
      }],

      function(err) {
         cnn.release();
      });
   }

   else {
      res.status(GOOD_STATUS).end();
   	  cnn.release();
   }
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      req.cnn.chkQry('select email, firstName, lastName, id, ' +
       'role, termsAccepted, whenRegistered from Person where id = ?',
       [req.params.id], cb);
   },

   function(prsArr, fields, cb) {
      if (vld.check(prsArr.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(req.params.id, cb)) {
      	 for (var i = 0; i < prsArr.length; i++) {
      	    if (prsArr[i].termsAccepted)
      	 	     prsArr[i].termsAccepted = prsArr[i].termsAccepted.getTime();
            if (prsArr[i].whenRegistered)
      	 	     prsArr[i].whenRegistered = prsArr[i].whenRegistered.getTime();
      	 }

        res.json(prsArr);
        cb();
      }
   }],

   function(err) {
      req.cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      req.cnn.query('select * from Person where id = ?', [req.params.id],
       function(err, prsArr) {
          if (vld.check(prsArr.length, Tags.notFound))
             res.json(prsArr);
          req.cnn.release();
      });
   }

   else {
      req.cnn.release();
   }
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;
   var id = req.params.id;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.checkAdmin(cb))
         cnn.chkQry('select * from Person where id = ?', [id], cb);
   },

   function(prs, fields, cb) {
      if (prs && vld.check(prs.length, Tags.notFound, null, cb)) {
         cnn.chkQry('delete from Person where id = ?', [id], cb);
      }
   },

   function (result, fields, cb) {
      res.status(GOOD_STATUS).end();
      cb();
   }],

   function(err) {
      console.log('in err');
      cnn.release();
   });
});

module.exports = router;
