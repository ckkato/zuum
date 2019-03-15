// Create a validator that draws its session from |req|, and reports
// errors on |res|
const GOOD_STATUS = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

var Validator = function(req, res) {
   this.errors = [];   // Array of error objects having tag and params
   this.session = req.session;
   this.res = res;
};

// List of errors, and their corresponding resource string tags
Validator.Tags = {
   noLogin: "noLogin",              // No active session/login
   noPermission: "noPermission",    // Login lacks permission.
   missingField: "missingField",    // Field missing from request. Params[0]
   badValue: "badValue",            // Field has bad value.  Params[0]
   notFound: "notFound",            // Entity not present in DB
   badLogin: "badLogin",            // Email/password combination invalid
   dupEmail: "dupEmail",            // Email duplicates an existing email
   noTerms: "noTerms",              // Acceptance of terms is required.
   forbiddenRole: "forbiddenRole",  // Cannot set to this role
   noOldPwd: "noOldPwd",            // requires an old password
   dupTitle: "dupTitle",            // Title duplicates Conversation title
   queryFailed: "queryFailed",
   forbiddenField: "forbiddenField",
   oldPwdMismatch: "oldPwdMismatch"
};


Validator.prototype.check = function(test, tag, params, cb) {
   if (!test)
      this.errors.push({tag: tag, params: params});

   if (this.errors.length) {
      if (this.res) {
         if (this.errors[0].tag === Validator.Tags.noPermission)
            this.res.status(FORBIDDEN).end();
         else
            this.res.status(BAD_REQUEST).json(this.errors);
         this.res = null;   // Preclude repeated closings
      }

      if (cb)
         cb(this);
   }
   return !this.errors.length;
};

// Somewhat like |check|, but designed to allow several chained checks
// in a row, finalized by a check call.
Validator.prototype.chain = function(test, tag, params) {
   if (!test) {
      this.errors.push({tag: tag, params: params});
   }
   return this;
};

Validator.prototype.checkAdmin = function(cb) {
   return this.check(this.session && this.session.isAdmin(),
    Validator.Tags.noPermission, null, cb);
};

// Validate that AU is the specified person or is an admin
Validator.prototype.checkPrsOK = function(prsId, cb) {
   return this.check(this.session &&
    (this.session.isAdmin() || this.session.id === parseInt(prsId)),
    Validator.Tags.noPermission, null, cb);
};

// Check presence of truthy property in |obj| for all fields in fieldList
Validator.prototype.hasFields = function(obj, fieldList, cb) {
   var self = this;

   fieldList.forEach(function(name) {
      self.chain(obj.hasOwnProperty(name), Validator.Tags.missingField, [name]);
   });

   return this.check(true, null, null, cb);
};

//error checks for any extra fields
Validator.prototype.checkFields = function(obj, cb) {
   var self = this;

   Object.keys(obj).forEach(function(name) {
      console.log(name);
      var valid = (name === 'email' || name === 'phoneNumber' ||
       name === 'firstName' ||
       name === 'lastName' || name === 'password' ||
       name === 'oldPassword' || name === 'role' || name === 'model' ||
       name === 'make' || name === 'year');
      if (!valid)
         self.chain(valid, Validator.Tags.forbiddenField, [name]);

   });
   return this.check(true, null, null, cb);
};

module.exports = Validator;
