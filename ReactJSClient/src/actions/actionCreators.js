import * as api from '../api';

export function signIn(credentials, cb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGIN_ERR', details: error}));
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'LOGOUT_ERR', details: error}));
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.postUsr(data)
      .then((usrs) => {if (cb) cb();})
      .catch(error => dispatch({type: 'REGISTER_ERR', details: error}));
   };
}


export function updateRds(userId, cb) {
   return (dispatch, prevState) => {
      api.getRd(userId)
      .then((rds) => dispatch({ type: 'UPDATE_RDS', rds}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'UPDATE_RDS_ERR', details: error}));
   };
}

export function addRd(newRds, cb) {
   return (dispatch, prevState) => {
      api.postRd(newRds)
      .then(rdsRsp => dispatch({type: 'ADD_RD', rds: rdsRsp[0]}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'ADD_RD_ERR', details: error}));
   };
}

export function modRd(rdId, start, end, capacity, fee, cb) {
   return (dispatch, prevState) => {

      api.putRd(rdId, {startDestination: start, endDestination: end,
          capacity: capacity, fee: fee})
      .then((rds) => dispatch({type: 'UPDATE_RD', data: {rdId: rdId,
                  startDestination: start, endDestination: end,
                  capacity: capacity, fee: fee}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'UPDATE_RD_ERR', details: error}));
   };
}

export function delRd(rdId, cb){
   return (dispatch, prevState) => {
      api.delRd(rdId)
      .then(() => dispatch({type: 'DELETE_RD', id: rdId}))
      .then(() => {if(cb) cb();})
      .catch(error => dispatch({type: 'DELETE_ERR', details: error}));
   };
}

export function getDriverRequests(rd, cb) {
   return (dispatch, prevState) => {
      api.getDrvRequests(rd.id)
      .then((rqsts) => dispatch({type: 'UPDATE_RQTS', data: rqsts, ride: rd}))
      .then(() => {if(cb) cb();})
      .catch(error => dispatch({type: 'GET_REQUESTS_ERR', details: error}));
   }
}

export function modAccept(ride, cb) {
   return (dispatch, prevState) => {
      api.putAccept(ride)
      .then((req) => dispatch({type: 'ACCEPT', data: req}))
      .then(() => {if(cb) cb();})
      .catch(error => dispatch({type: 'ACCEPT_ERR', details: error}));
   }
}

export function addRqst(id, ride, rqst, cb) {
   ride.email=rqst.email;
   return (dispatch, prevState) => {
      api.postRqst(id, rqst)
      .then((rs) => dispatch({type: 'ADD_REQUEST', data: rqst, ride: ride,
       request: rs}))
      .then(() => {if(cb) cb(); })
      .catch(error => dispatch({type: 'ADD_REQUEST_ERR', details: error}));
   };
}


export function updateRequests(id, cb) {
   return (dispatch, prevState) => {
      api.getRides(id)
      .then((ride) => dispatch({ type: 'UPDATE_REQUESTS'}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'UPDATE_REQUESTS_ERR', details: error}));
   }
}

export function addMsg(cnvId, newMsg, cb){
   return (dispatch, prevState) => {
      api.postMsg(cnvId, newMsg)
      .then(msgRsp => dispatch({type: 'ADD_MSG', msg: msgRsp}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'ADD_MSG_ERR', details: error}));
   };
}

export function updateMsgs(cnvId, cb) {
   return (dispatch, prevState) => {
      api.getMsgs(cnvId)
      .then((msgs) => dispatch({ type: 'UPDATE_MSGS', msgs}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'UPDATE_MSGS_ERR', details: error}));
   };
}

export function updateErrs(cb){
   return (dispatch, prevState) => {
      Promise.resolve(dispatch({type: 'CLEAR_ERRS'}));
   };
}
