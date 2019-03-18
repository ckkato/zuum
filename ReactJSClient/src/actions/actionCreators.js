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
   console.log(data);
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
   console.log(newRds);
   return (dispatch, prevState) => {
      api.postRd(newRds)
      .then(rdsRsp => dispatch({type: 'ADD_RD', rds: rdsRsp[0]}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'ADD_RD_ERR', details: error}));
   };
}

export function modRd(rdId, title, cb) {
   return (dispatch, prevState) => {
      api.putRd(rdId, {title: title})
      .then((rds) => dispatch({type: 'UPDATE_RD', data: {cnvId: rdId, title: title}}))
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'UPDATE_RD_ERR', details: error}));
   };
}

export function delRd(rdId, cb){
   return (dispatch, prevState) => {
      api.delRd(rdId)
      .then(() => dispatch({type: 'DELETE_CNV', id: rdId}))
      .then(() => {if(cb) cb();})
      .catch(error => dispatch({type: 'DELETE_ERR', details: error}));
   };
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
