export default function Errs(state = [], action) {
   console.log("Errs reducing action " + action.type);

   switch (action.type) {
      case 'LOGIN_ERR':
         return state.concat(action.details);
      case 'LOGOUT_ERR':
         return state.concat(action.details);
      case 'REGISTER_ERR':
         return state.concat(action.details);
      case 'UPDATE_RDS_ERR':
         return state.concat(action.details);
      case 'ADD_RD_ERR':
         return state.concat(action.details);
      case 'UPDATE_CRD_ERR':
         return state.concat(action.details);
      case 'DELETE_ERR':
         return state.concat(action.details);
      case 'UPDATE_REQUESTS_ERR':
         return state.concat(action.details);
      case 'ADD_REQUEST_ERR':
         return state.concat(action.details);
      case 'CLEAR_ERRS':
         return state = [];
      default:
         state = [];
         return state;
   }
}
